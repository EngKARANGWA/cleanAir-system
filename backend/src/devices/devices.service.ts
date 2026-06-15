import { Injectable, NotFoundException } from '@nestjs/common';
import { AlertLevel, DeviceStatus, ReadingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateDeviceDto {
  name: string;
  type?: string;
  owner?: string;
  plateOrRef?: string;
  location: string;
  firmware?: string;
  ip?: string;
  mac?: string;
  safetyStatus?: string;
}

export interface PostReadingDto {
  inputPpm: number;
  outputPpm: number;
  uptime?: string;
  firmware?: string;
  ip?: string;
  mac?: string;
}

export interface UpdateDeviceDto {
  name?: string;
  type?: string;
  owner?: string;
  plateOrRef?: string;
  location?: string;
  status?: DeviceStatus;
  firmware?: string;
  ip?: string;
  mac?: string;
  safetyStatus?: string;
}

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateId(): Promise<string> {
    const last = await this.prisma.device.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });
    if (!last) return 'ESP32-001';
    const match = last.id.match(/ESP32-(\d+)/i);
    if (!match) return 'ESP32-001';
    const next = parseInt(match[1], 10) + 1;
    return `ESP32-${String(next).padStart(3, '0')}`;
  }

  findAll() {
    return this.prisma.device.findMany({ orderBy: { lastSeen: 'desc' } });
  }

  async findOne(id: string) {
    const device = await this.prisma.device.findUnique({ where: { id } });
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async create(dto: CreateDeviceDto) {
    const id = await this.generateId();
    return this.prisma.device.create({
      data: {
        id,
        name: dto.name,
        type: dto.type ?? 'car',
        owner: dto.owner,
        plateOrRef: dto.plateOrRef,
        location: dto.location,
        firmware: dto.firmware,
        ip: dto.ip,
        mac: dto.mac,
        safetyStatus: dto.safetyStatus ?? 'NORMAL',
      },
    });
  }

  async update(id: string, dto: UpdateDeviceDto) {
    await this.findOne(id);
    return this.prisma.device.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type,
        owner: dto.owner,
        plateOrRef: dto.plateOrRef,
        location: dto.location,
        status: dto.status,
        firmware: dto.firmware,
        ip: dto.ip,
        mac: dto.mac,
        safetyStatus: dto.safetyStatus,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.device.delete({ where: { id } });
    return { success: true };
  }

  async postReading(deviceId: string, dto: PostReadingDto) {
    const device = await this.findOne(deviceId);

    const { inputPpm, outputPpm } = dto;
    const reduction =
      inputPpm > 0 ? Math.round(((inputPpm - outputPpm) / inputPpm) * 10000) / 100 : 0;

    const readingStatus =
      inputPpm >= 500 ? ReadingStatus.CRITICAL :
      inputPpm >= 400 ? ReadingStatus.WARNING :
      ReadingStatus.NORMAL;

    const deviceStatus = inputPpm >= 400 ? DeviceStatus.WARNING : DeviceStatus.ONLINE;

    const [reading, updatedDevice] = await this.prisma.$transaction([
      this.prisma.reading.create({
        data: {
          deviceId,
          inputPpm,
          outputPpm,
          reductionPercentage: reduction,
          status: readingStatus,
        },
      }),
      this.prisma.device.update({
        where: { id: deviceId },
        data: {
          coInput: inputPpm,
          coOutput: outputPpm,
          reduction,
          status: deviceStatus,
          lastSeen: new Date(),
          ...(dto.uptime   && { uptime:   dto.uptime }),
          ...(dto.firmware && { firmware: dto.firmware }),
          ...(dto.ip       && { ip: dto.ip }),
          ...(dto.mac      && { mac: dto.mac }),
        },
      }),
    ]);

    // Avoid alert spam: skip if a same-level alert for this device was created in the last 5 min
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

    if (inputPpm >= 500) {
      const recent = await this.prisma.alert.findFirst({
        where: { deviceId, level: AlertLevel.CRITICAL, createdAt: { gte: fiveMinAgo } },
      });
      if (!recent) {
        await this.prisma.alert.create({
          data: {
            deviceId,
            level: AlertLevel.CRITICAL,
            message: `CO input at ${inputPpm} ppm on ${device.plateOrRef ?? deviceId}. Exceeds 500 ppm safety threshold.`,
            location: device.location,
          },
        });
      }
    } else if (inputPpm >= 400) {
      const recent = await this.prisma.alert.findFirst({
        where: { deviceId, level: AlertLevel.WARNING, createdAt: { gte: fiveMinAgo } },
      });
      if (!recent) {
        await this.prisma.alert.create({
          data: {
            deviceId,
            level: AlertLevel.WARNING,
            message: `CO input at ${inputPpm} ppm on ${device.plateOrRef ?? deviceId}. Above 400 ppm warning threshold.`,
            location: device.location,
          },
        });
      }
    }

    if (reduction < 45 && inputPpm > 0) {
      const recent = await this.prisma.alert.findFirst({
        where: {
          deviceId,
          level: AlertLevel.WARNING,
          message: { contains: 'purification' },
          createdAt: { gte: fiveMinAgo },
        },
      });
      if (!recent) {
        await this.prisma.alert.create({
          data: {
            deviceId,
            level: AlertLevel.WARNING,
            message: `Low purification efficiency at ${reduction}% on ${device.plateOrRef ?? deviceId}, below the 45% target.`,
            location: device.location,
          },
        });
      }
    }

    return { reading, device: updatedDevice };
  }
}

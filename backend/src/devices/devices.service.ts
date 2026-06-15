import { Injectable, NotFoundException } from '@nestjs/common';
import { DeviceStatus } from '@prisma/client';
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
}

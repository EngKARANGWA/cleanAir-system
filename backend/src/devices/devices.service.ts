import { Injectable, NotFoundException } from '@nestjs/common';
import { DeviceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateDeviceDto {
  id: string;
  name: string;
  location: string;
  firmware?: string;
  ipAddress?: string;
  macAddress?: string;
  installedAt?: string;
}

export interface UpdateDeviceDto {
  name?: string;
  location?: string;
  status?: DeviceStatus;
  firmware?: string;
  ipAddress?: string;
  macAddress?: string;
}

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.device.findMany({ orderBy: { lastSeen: 'desc' } });
  }

  async findOne(id: string) {
    const device = await this.prisma.device.findUnique({ where: { id } });
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  create(dto: CreateDeviceDto) {
    return this.prisma.device.create({
      data: {
        id: dto.id,
        name: dto.name,
        location: dto.location,
        firmware: dto.firmware,
        ipAddress: dto.ipAddress,
        macAddress: dto.macAddress,
        installedAt: dto.installedAt ? new Date(dto.installedAt) : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateDeviceDto) {
    await this.findOne(id);
    return this.prisma.device.update({
      where: { id },
      data: {
        name: dto.name,
        location: dto.location,
        status: dto.status,
        firmware: dto.firmware,
        ipAddress: dto.ipAddress,
        macAddress: dto.macAddress,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.device.delete({ where: { id } });
    return { success: true };
  }
}

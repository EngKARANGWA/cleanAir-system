import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadingsService {
  constructor(private readonly prisma: PrismaService) {}

  getLatest() {
    return this.prisma.reading.findMany({
      take: 10,
      orderBy: { recordedAt: 'desc' },
      include: {
        device: { select: { id: true, name: true, location: true } },
      },
    });
  }

  getHistory(deviceId?: string, limit = 100) {
    return this.prisma.reading.findMany({
      where: deviceId ? { deviceId } : undefined,
      take: limit,
      orderBy: { recordedAt: 'desc' },
      include: {
        device: { select: { id: true, name: true, location: true } },
      },
    });
  }
}

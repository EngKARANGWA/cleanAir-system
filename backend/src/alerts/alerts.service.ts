import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(limit = 50) {
    return this.prisma.alert.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        device: { select: { id: true, name: true, location: true } },
      },
    });
  }

  getRules() {
    return [
      { id: 1, name: 'High CO Input',     threshold: 50,  level: 'WARNING',  metric: 'inputPpm' },
      { id: 2, name: 'Critical CO Input', threshold: 100, level: 'CRITICAL', metric: 'inputPpm' },
      { id: 3, name: 'Device Offline',    threshold: 0,   level: 'WARNING',  metric: 'status' },
    ];
  }
}

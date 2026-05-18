import { Controller, Get, Query } from '@nestjs/common';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get('latest')
  getLatest() {
    return this.readingsService.getLatest();
  }

  @Get('history')
  getHistory(
    @Query('deviceId') deviceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.readingsService.getHistory(deviceId, limit ? parseInt(limit) : 100);
  }
}

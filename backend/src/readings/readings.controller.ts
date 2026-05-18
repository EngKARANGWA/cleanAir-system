import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ReadingsService } from './readings.service';

@ApiTags('Readings')
@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get the 10 most recent readings across all devices' })
  @ApiResponse({ status: 200, description: 'Array of latest readings with device info.' })
  getLatest() {
    return this.readingsService.getLatest();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get reading history, optionally filtered by device' })
  @ApiQuery({ name: 'deviceId', required: false, example: 'ESP32-001' })
  @ApiQuery({ name: 'limit',    required: false, example: 100 })
  @ApiResponse({ status: 200, description: 'Array of historical readings.' })
  getHistory(
    @Query('deviceId') deviceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.readingsService.getHistory(deviceId, limit ? parseInt(limit) : 100);
  }
}

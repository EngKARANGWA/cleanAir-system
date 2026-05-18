import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'List recent alerts across all devices' })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiResponse({ status: 200, description: 'Array of alerts with device info.' })
  findAll(@Query('limit') limit?: string) {
    return this.alertsService.findAll(limit ? parseInt(limit) : 50);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get the configured alert threshold rules' })
  @ApiResponse({ status: 200, description: 'Array of alert rules.' })
  getRules() {
    return this.alertsService.getRules();
  }
}

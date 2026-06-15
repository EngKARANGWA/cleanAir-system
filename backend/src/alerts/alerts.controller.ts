import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
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

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all alerts as read' })
  @ApiResponse({ status: 200, description: 'All alerts marked as read.' })
  markAllRead() {
    return this.alertsService.markAllRead();
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a single alert as read' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Alert marked as read.' })
  markRead(@Param('id') id: string) {
    return this.alertsService.markRead(+id);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get the configured alert threshold rules' })
  @ApiResponse({ status: 200, description: 'Array of alert rules.' })
  getRules() {
    return this.alertsService.getRules();
  }
}

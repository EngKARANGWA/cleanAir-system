import { Controller, Get, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.alertsService.findAll(limit ? parseInt(limit) : 50);
  }

  @Get('rules')
  getRules() {
    return this.alertsService.getRules();
  }
}

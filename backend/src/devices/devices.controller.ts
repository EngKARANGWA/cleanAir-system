import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { DevicesService, CreateDeviceDto, UpdateDeviceDto, PostReadingDto } from './devices.service';

@ApiTags('Devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @ApiOperation({ summary: 'List all devices' })
  @ApiResponse({ status: 200, description: 'Array of all registered devices.' })
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single device by ID' })
  @ApiParam({ name: 'id', example: 'ESP32-001' })
  @ApiResponse({ status: 200, description: 'Device found.' })
  @ApiResponse({ status: 404, description: 'Device not found.' })
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new device' })
  @ApiBody({
    schema: {
      example: {
        id: 'ESP32-001',
        name: 'Factory Sensor A',
        location: 'Building 1 - Floor 2',
        firmware: 'v1.2.0',
        ipAddress: '192.168.1.42',
        macAddress: 'AA:BB:CC:DD:EE:FF',
        installedAt: '2025-01-15T08:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Device registered successfully.' })
  create(@Body() dto: CreateDeviceDto) {
    return this.devicesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a device' })
  @ApiParam({ name: 'id', example: 'ESP32-001' })
  @ApiBody({
    schema: {
      example: {
        name: 'Factory Sensor A (updated)',
        location: 'Building 2 - Floor 1',
        status: 'ONLINE',
        firmware: 'v1.3.0',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Device updated.' })
  @ApiResponse({ status: 404, description: 'Device not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateDeviceDto) {
    return this.devicesService.update(id, dto);
  }

  @Post(':id/readings')
  @ApiOperation({ summary: 'Post a sensor reading for a device (used by ESP32 firmware)' })
  @ApiParam({ name: 'id', example: 'ESP32-001' })
  @ApiBody({
    schema: {
      example: { inputPpm: 420, outputPpm: 210, uptime: '3d 4h', firmware: 'v1.2.0', ip: '192.168.1.10', mac: 'AA:BB:CC:DD:EE:FF' },
    },
  })
  @ApiResponse({ status: 201, description: 'Reading recorded and device state updated.' })
  postReading(@Param('id') id: string, @Body() dto: PostReadingDto) {
    return this.devicesService.postReading(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a device' })
  @ApiParam({ name: 'id', example: 'ESP32-001' })
  @ApiResponse({ status: 200, description: 'Device deleted.' })
  @ApiResponse({ status: 404, description: 'Device not found.' })
  remove(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }
}

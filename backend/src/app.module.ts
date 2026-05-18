import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { ReadingsModule } from './readings/readings.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [PrismaModule, MailModule, UsersModule, AuthModule, DevicesModule, ReadingsModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

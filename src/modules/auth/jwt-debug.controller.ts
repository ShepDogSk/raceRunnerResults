import { Controller, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth/debug')
export class JwtDebugController {
  private readonly logger = new Logger(JwtDebugController.name);

  constructor(private jwtService: JwtService) {
    this.logger.log('JWT Debug Controller initialized');
  }

  @UseGuards(JwtAuthGuard)
  @Get('token-info')
  getTokenInfo(@Request() req) {
    this.logger.log(`Token debug info requested by user: ${req.user.username}`);
    return {
      user: req.user,
      message: 'JWT validation successful',
      timestamp: new Date().toISOString()
    };
  }

  @Get('health')
  healthCheck() {
    this.logger.log('JWT Debug health check');
    return {
      status: 'ok',
      message: 'JWT Debug Controller is working',
      timestamp: new Date().toISOString()
    };
  }
}


import { Controller, Post, Body, UseGuards, Request, Get, Logger, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../../entities/user.entity';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(private readonly authService: AuthService) {
    this.logger.log('Auth Controller initialized');
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    this.logger.log(`Login endpoint called for user: ${req.user.username}`);
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    this.logger.log(`Profile accessed by user: ${req.user.username}`);
    return req.user;
  }

  @Post('register')
  async register(@Body() user: User) {
    this.logger.log(`Register endpoint called for username: ${user.username}`);
    return this.authService.register(user);
  }

  @Get('verify-token')
  async verifyToken(@Headers('authorization') authHeader: string) {
    this.logger.log('Verify token endpoint called');
    
    if (!authHeader) {
      this.logger.warn('No authorization header provided');
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      const token = authHeader.split(' ')[1];
      this.logger.log(`Verifying token: ${token.substring(0, 20)}...`);
      
      const decoded = this.authService.verifyToken(token);
      this.logger.log('Token verification successful');
      
      return {
        valid: true,
        decoded,
        message: 'Token is valid'
      };
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      return {
        valid: false,
        message: 'Invalid token'
      };
    }
  }
}


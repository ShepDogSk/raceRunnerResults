import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.log(`Passport local strategy validating user: ${username}`);
    
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.logger.warn(`Authentication failed for user: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    this.logger.log(`Authentication successful for user: ${username}`);
    return user;
  }
}

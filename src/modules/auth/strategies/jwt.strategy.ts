import { Injectable, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  
  constructor() {
    // Use a fixed secret key for now to ensure consistency
    const jwtSecret = 'secretKey';
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
    
    this.logger.log(`JWT Strategy initialized with fixed secret key`);
    this.logger.log(`JWT extraction method: Bearer Token from Authorization header`);
  }

  async validate(payload: any) {
    try {
      this.logger.log(`Raw payload received: ${JSON.stringify(payload)}`);
      
      if (!payload) {
        this.logger.error('JWT payload is null or undefined');
        throw new UnauthorizedException('Invalid token payload');
      }
      
      // Log all payload properties to help debug
      Object.keys(payload).forEach(key => {
        this.logger.log(`Payload property ${key}: ${JSON.stringify(payload[key])}`);
      });
      
      // More flexible validation to handle different payload structures
      const userId = payload.sub || payload.id || payload.userId;
      const username = payload.username || payload.user || payload.name;
      const role = payload.role || 'user';
      
      if (!userId || !username) {
        this.logger.error(`Cannot extract user info from payload: ${JSON.stringify(payload)}`);
        throw new UnauthorizedException('Cannot extract user information from token');
      }
      
      const user = { id: userId, username, role };
      this.logger.log(`JWT validation successful, constructed user: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(`JWT validation error: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token validation failed');
    }
  }
}


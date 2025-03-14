import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {
    super();
    this.logger.log('JWT Auth Guard initialized with enhanced logging');
  }
  
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const path = request.path;
    const method = request.method;
    
    this.logger.log(`JWT Auth Guard checking request: ${method} ${path}`);
    
    // Log all headers for debugging
    this.logger.log('Request headers:');
    Object.keys(request.headers).forEach(header => {
      if (header.toLowerCase() === 'authorization') {
        this.logger.log(`  ${header}: ${request.headers[header].substring(0, 15)}...`);
        
        // Try to manually decode the token for debugging
        try {
          const token = request.headers[header].split(' ')[1];
          const decoded = this.jwtService.decode(token);
          this.logger.log(`Manually decoded token: ${JSON.stringify(decoded)}`);
        } catch (error) {
          this.logger.error(`Error manually decoding token: ${error.message}`);
        }
      } else {
        this.logger.log(`  ${header}: ${request.headers[header]}`);
      }
    });
    
    if (!request.headers.authorization) {
      this.logger.warn('No Authorization header found in request');
      throw new UnauthorizedException('No authorization token provided');
    }
    
    // Call the parent canActivate method
    const result = super.canActivate(context);
    this.logger.log(`JWT Auth Guard canActivate called`);
    return result;
  }

  handleRequest(err, user, info, context) {
    this.logger.log(`JWT Auth Guard handleRequest called`);
    
    if (err) {
      this.logger.error(`JWT Auth error: ${err.message}`);
      this.logger.error(`JWT Auth error stack: ${err.stack}`);
      throw err;
    }
    
    if (!user) {
      this.logger.error(`JWT Auth failed: No user found. Info: ${JSON.stringify(info || {})}`);
      
      // Try to extract more information about the failure
      let errorMessage = 'Authentication failed';
      if (info) {
        if (info.message) {
          errorMessage = info.message;
        }
        if (info.name === 'TokenExpiredError') {
          errorMessage = 'Token has expired';
        } else if (info.name === 'JsonWebTokenError') {
          errorMessage = 'Invalid token';
        }
      }
      
      throw new UnauthorizedException(errorMessage);
    }
    
    this.logger.log(`JWT Auth successful for user: ${JSON.stringify(user)}`);
    return user;
  }
}

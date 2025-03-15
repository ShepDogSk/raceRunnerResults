import { Injectable, ConflictException, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject('JWT_SECRET_PROVIDER') private jwtSecret: string,
  ) {
    this.logger.log('Auth Service initialized');
    this.logger.log(`Using fixed JWT Secret for consistency`);
  }

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.log(`Login attempt for user: ${username}`);
    
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      if (!user) {
        this.logger.warn(`Login failed: User not found - ${username}`);
        return null;
      }
      
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        this.logger.log(`Login successful for user: ${username}`);
        const { password, ...result } = user;
        return result;
      } else {
        this.logger.warn(`Login failed: Invalid password for user - ${username}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error validating user ${username}: ${error.message}`);
      throw new UnauthorizedException('Authentication error');
    }
  }

  async login(user: any) {
    try {
      this.logger.log(`Generating JWT token for user: ${user.username}`);
      
      // Create the payload with all necessary user information
      const payload = { 
        username: user.username, 
        sub: user.id, 
        role: user.role,
        iat: Math.floor(Date.now() / 1000) // issued at time
      };
      
      this.logger.log(`JWT payload created: ${JSON.stringify(payload)}`);
      
      // Sign the token with the JWT secret
      const token = this.jwtService.sign(payload);
      
      this.logger.log(`Token generated successfully for ${user.username}, length: ${token.length}`);
      this.logger.log(`Token starts with: ${token.substring(0, 20)}...`);
      
      return {
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`Error generating token for ${user.username}: ${error.message}`);
      throw new UnauthorizedException('Error generating authentication token');
    }
  }

  async register(user: User) {
    this.logger.log(`Registration attempt for username: ${user.username}`);
    
    try {
      const existingUser = await this.userRepository.findOne({ where: { username: user.username } });
      if (existingUser) {
        this.logger.warn(`Registration failed: Username already exists - ${user.username}`);
        throw new ConflictException('Username already exists');
      }
      
      const newUser = this.userRepository.create(user);
      await this.userRepository.save(newUser);
      
      this.logger.log(`User registered successfully: ${user.username}`);
      
      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error registering user ${user.username}: ${error.message}`);
      throw new UnauthorizedException('Registration error');
    }
  }

  // Method to verify a token (useful for debugging)
  verifyToken(token: string) {
    try {
      this.logger.log(`Verifying token: ${token.substring(0, 20)}...`);
      const decoded = this.jwtService.verify(token);
      this.logger.log(`Token verified successfully: ${JSON.stringify(decoded)}`);
      return decoded;
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}


import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from '../../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtDebugController } from './jwt-debug.controller';

// Use a fixed secret key for consistency
const JWT_SECRET = 'secretKey';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { 
        expiresIn: '24h',
        algorithm: 'HS256'
      },
    }),
  ],
  controllers: [AuthController, JwtDebugController],
  providers: [
    {
      provide: 'JWT_SECRET_PROVIDER',
      useValue: JWT_SECRET,
    },
    {
      provide: 'AUTH_LOGGER',
      useFactory: () => {
        const logger = new Logger('AuthModule');
        logger.log(`Auth Module initialized with fixed JWT Secret`);
        return logger;
      }
    },
    AuthService, 
    JwtStrategy, 
    LocalStrategy
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}


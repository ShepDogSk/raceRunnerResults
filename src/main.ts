import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Starting application...');
  
  // Use fixed JWT Secret for consistency
  const jwtSecret = 'secretKey';
  logger.log(`Using fixed JWT Secret for consistency`);
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  logger.log('Global prefix set to /api');
  
  // Enable CORS
  app.enableCors();
  logger.log('CORS enabled');
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  logger.log('Validation pipe enabled');
  
  // Add request logging middleware
  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`);
    if (req.headers.authorization) {
      logger.log(`Authorization header present: ${req.headers.authorization.substring(0, 15)}...`);
    }
    next();
  });
  logger.log('Request logging middleware added');
  
  // Serve static files from the client/dist directory
  app.useStaticAssets(join(__dirname, '..', 'client', 'dist'));
  logger.log(`Static assets path: ${join(__dirname, '..', 'client', 'dist')}`);
  
  // Handle client-side routing by redirecting all non-API routes to index.html
  app.use((req, res, next) => {
    const path = req.path;
    if (path.startsWith('/api')) {
      next();
    } else if (
      path.includes('.') && 
      !path.endsWith('.html')
    ) {
      // Let NestJS handle static assets
      next();
    } else {
      // Serve index.html for client-side routing
      res.sendFile(join(__dirname, '..', 'client', 'dist', 'index.html'));
    }
  });
  logger.log('Client-side routing handler added');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap().catch(err => {
  const logger = new Logger('Bootstrap');
  logger.error(`Error during bootstrap: ${err.message}`);
  logger.error(err.stack);
});


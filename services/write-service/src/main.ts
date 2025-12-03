import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, // Enable CORS by default
    bufferLogs: true, // Buffer logs for better startup performance
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unexpected fields
      forbidNonWhitelisted: true, // Throw if unknown fields are present
      transform: true, // Convert payloads to DTO instances
    }),
  );

  // Global prefix for all routes (optional)
  app.setGlobalPrefix('api');

  await app.listen(3000);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { loggingMiddleware } from './middlewares/logging.middleware';
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: true, // Enable CORS by default
      bufferLogs: true, // Buffer logs for better startup performance
    });

    app.use(loggingMiddleware);
    app.enableShutdownHooks();

    // app.useGlobalPipes(
    //   new ValidationPipe({
    //     whitelist: true, // Strip unexpected fields
    //     forbidNonWhitelisted: true, // Throw if unknown fields are present
    //     transform: true, // Convert payloads to DTO instances
    //   }),
    // );

    await app.listen(3001);
  } catch (error) {
    console.error('Failed to launch server', error);
  }
}

bootstrap().catch((error) => {
  console.error('Failed to launch server', error);
});

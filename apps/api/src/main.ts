import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow frontend on localhost:4200 to call the API
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();

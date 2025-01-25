import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Origin',
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  app.enableCors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();

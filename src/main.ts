/*import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({path: path.resolve(__dirname + '../.env') });*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();

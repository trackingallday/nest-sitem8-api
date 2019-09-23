import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CompanyGuardInterceptor } from './common/companyGuard.interceptor';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new CompanyGuardInterceptor());
  await app.listen(3000);
}

bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src_apps/index';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3002', // 로컬 개발 환경
      'http://192.168.40.99:3002',
      'http://localhost:3000', // 로컬 개발 환경
      'http://192.168.40.99:3000',
      'http://localhost:8082', // 로컬 개발 환경
      'http://192.168.40.99:8082',
    ],
    credentials: true,
  }); // CORS 활성화
  await app.listen(process.env.APP_PORT ?? 8081, '0.0.0.0');
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});

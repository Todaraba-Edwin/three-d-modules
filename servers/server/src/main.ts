import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src_apps/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3002', // 로컬 개발 환경
      'http://192.168.40.100:3002',
    ],
    credentials: true,
  }); // CORS 활성화
  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});

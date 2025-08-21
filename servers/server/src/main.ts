import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src_apps/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});

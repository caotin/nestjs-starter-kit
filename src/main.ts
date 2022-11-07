import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { APP_PORT } from '@/environments';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Osekkai API docs')
    .setDescription('The Osekkai is refer matching friends')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT);

  console.log(
    '\x1b[36m',
    `\nServer listening on: http://localhost:${APP_PORT}\nAPI docs: http://localhost:${APP_PORT}/docs`,
  );
}
bootstrap();

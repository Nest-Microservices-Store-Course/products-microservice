import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from './configs';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: env.port,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  const logger = new Logger('NestApplication');

  // await app.listen(env.port).then(() => {
  //   logger.log(`Server is running on port ${env.port}`);
  // });
  await app.listen().then(() => {
    logger.log(`Server is running on port ${env.port}`);
  });
}
bootstrap();

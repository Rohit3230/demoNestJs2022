// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
// import * as helmet from 'helmet';
// import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
// import AppLogger from './core/middleware/app-logger';
import EnvironmentFile from './core/config/EnvironmentFile';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  let logger = new Logger('bootstrap');
  app.enableCors();
  // app.enableCors();
  // app.use(helmet());
  // app.set('trust proxy', 1);
  // app.use(
  //   rateLimit({
  //     windowMs: 1000, // 1 sec
  //     max: 15, // limit each IP to 10 requests per windowMs
  //   }),
  // )


  // app.use(AppLogger);
  app.useGlobalPipes(new ValidationPipe());
  let server = await app.listen(configService.get('PORT') || 3000);
  server.setTimeout(600000)
  logger.log(`app started on ${await app.getUrl()}`);
  EnvironmentFile();
}

bootstrap();

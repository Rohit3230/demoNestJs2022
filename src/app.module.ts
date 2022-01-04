import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import EnvironmentFile from './core/config/EnvironmentFile';
import Configuration from './core/config/Configuration';
import { MongooseConfigService } from './core/config/MongooseConfigService';
import { TerminusModule } from '@nestjs/terminus';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module'; 
import { UtilityModule } from './utility/utility.module';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      envFilePath: EnvironmentFile(),
      load: [Configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    CoreModule,
    UserModule,
    UtilityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

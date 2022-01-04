// import { HttpModule, Module } from '@nestjs/common';
import { Module } from '@nestjs/common';
// import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FileHandlerService } from './services/FileHandler.service';
import { AwsS3Service } from './services/awsS3.service';

@Module({
    imports: [
        ConfigModule,
        // HttpModule
    ],
    providers: [ FileHandlerService, AwsS3Service],
    exports: [ FileHandlerService, AwsS3Service]
})
export class UtilityModule { }

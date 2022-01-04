import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

import { ConfigService } from '@nestjs/config';


@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(private configService: ConfigService) {
    }

    createMongooseOptions(): MongooseModuleOptions {
        console.log("Mongo ", this.configService.get('mongoUri'));
        return {
            uri: this.configService.get('mongoUri'),
            useNewUrlParser: true
        };
    }
}
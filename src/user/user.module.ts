import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UtilityModule } from '../utility/utility.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema, UsersSchemaName } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersSchemaName, schema: UsersSchema }
    ]),
    ConfigModule,
    UtilityModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports : [UserService, UserRepository]
})
export class UserModule {}

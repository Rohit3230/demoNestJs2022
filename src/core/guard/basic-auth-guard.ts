import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { Reflector } from '@nestjs/core';
import { UserRepository } from 'src/user/user.repository';
import { isMongoId } from 'class-validator'

@Injectable()
export class BasicAuthGuard implements CanActivate {

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
    private userRepository: UserRepository
  ) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    let resData = this.validateRequest(request, roles);

    return resData;
  }

  async validateRequest(req: any, roles): Promise<boolean> {

    const auth = {
      login: this.configService.get('auth').username,
      password: this.configService.get('auth').password
    }

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    if (login && password && login === auth.login && password === auth.password) {
      console.log("Basic Auth success :");
      return roles ? await this.checkForRolesPassed(req, roles) : true
    } else {
      console.log("Basic Auth failed :");
      throw new UnauthorizedException("Basic auth not found");
    }
  }

  async checkForRolesPassed(req, roles) {
    if ((roles.indexOf('userToken') !== -1)) {
      if (
        req.params?.uH
      ) {
        if (!isMongoId(req.params.uH)) {
          throw new BadRequestException("Invalid User's Id Found. It Must Be Mongo Id...!");
        } else if (req.headers['token']) {
          let projectionObj: any = { _id: 1, status: 1 };
          let reqObj: any = { token: req.headers['token'], _id: req.params.uH };
          let user = await this.userRepository.getUsersInfo(reqObj, projectionObj);
          if (!user) {
            throw new UnauthorizedException('User not found With Given Credentials...!');
          }
        } else {
          throw new UnauthorizedException("User's token not found");
        }
        return true;
      } else {
        throw new UnauthorizedException("User's Id not found");
      }
    } else {
      return true;
    }
  }
}
import { Req, Res, Query, Post, Get, Put, Delete, Controller, Body, Param, UseGuards } from '@nestjs/common';
import { ContentType } from '../core/contentType.decorator';
import { UserService } from './user.service';
import { UploadFileDto } from './dto/uploadFile.dto';
import e, { Request } from 'express';
import { loginRegisterDto, updateUsersInfoDto, getUsersDto } from './dto/user.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { UserToken } from '../core/decorators/userToken.decorator'
import { BasicAuthGuard } from '../core/guard/basic-auth-guard';

@Controller('user')
export class UserController {
    constructor(
        private service: UserService
    ){}

    @Post("/uploadDoc")
    // @Roles('userToken')   // will check the role of the user on the basis of token
    // @UseGuards(BasicAuthGuard) // will check operation is doing by authentic user or not.
    async uploadFile(
        @Req() req: Request,
        @Query() uploadFileDto: UploadFileDto,
        @ContentType() contentType: string,
        @UserToken() userToken: string
    ) {
        const { fileType, uH } = uploadFileDto
        console.log("fileType :%s , side :%s", fileType);
        return await this.service.uploadFile(req, fileType, contentType, uH);
    }

    @Post('/registerUser')
    @UseGuards(BasicAuthGuard)
    async registerUser(@Body() body: loginRegisterDto):Promise<{_id: string, token:string}>{
        return await this.service.registerUser(body);
    }

    @Post('/loginUser')
    @UseGuards(BasicAuthGuard)
    async loginUser(@Body() body: loginRegisterDto):Promise<{_id: string, token:string}>{
        return await this.service.loginUser(body);
    }

    @Post('/getAllUsers')
    @UseGuards(BasicAuthGuard)
    async getAllUsers(@Body() body: getUsersDto) : Promise<any>{
        return await this.service.getAllUsers(body);
    }    

    @Get('/getUsersInfo/:uH')
    @Roles('userToken')
    @UseGuards(BasicAuthGuard)
    async getUsersInfo( @Param('uH') id : String ) : Promise<any>{
        return this.service.getUsersInfo(id);
    }

    @Put('/updateUsersInfo/:uH')
    async updateUsersInfo( @Param('uH') id : String, @Body() body: updateUsersInfoDto ) : Promise<any>{
        //console.log('updateUsersInfo****', body, id);
        return this.service.updateUsersInfo(id, body);
    }

    @Delete('/deleteUsersProfile/:uH')
    @Roles('userToken')
    @UseGuards(BasicAuthGuard)
    async deleteUsersProfile(@Param('uH') id : String ) : Promise<any>{
        //console.log('deleteUsersProfile****', id);
        return this.service.deleteUsersProfile(id);
    }
    
}

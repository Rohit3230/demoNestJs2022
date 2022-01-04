import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import e, { Request } from 'express';
import { FileHandlerService } from '../utility/services/FileHandler.service';
import * as fs from 'fs';
import { AwsS3Service } from '../utility/services/awsS3.service';
import { loginRegisterDto } from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private fileHandlerService: FileHandlerService,
        private awsS3Service: AwsS3Service,
        private repository: UserRepository
    ){}

    async uploadFile(req: Request, fileType: string, contentType: string, userId: string, side: string=''): Promise<any> {
        let filePath: string
        try {
            filePath = await this.fileHandlerService.uploadFile(req, fileType, contentType);
            console.log("filePath ", filePath);
            const base64File = await this.fileHandlerService.fileToBase64(filePath);

            let file : any  = fs.readFileSync(filePath);            
            console.log('file***',file);
            let myFile = filePath.split(".")
            const localFileType = myFile[myFile.length - 1];
            console.log(localFileType,'**file type**',fileType, side);
            let awsResponse : any = await this.awsS3Service.uploadFile(file, fileType, contentType, userId+'_'+fileType+'_'+side+'_'+(new Date().getTime())+'.'+localFileType);
            console.log(contentType,'***awsResponse***',awsResponse);
            
            await this.updateUsersInfo({_id: userId},{ awsKey: awsResponse.key })

            if(awsResponse?.key){
                let getFileObj: any = await this.awsS3Service.getFileObject(awsResponse.key);
                console.log('getFileObj***',getFileObj);
            }

            this.fileHandlerService.deleteFile(filePath);
            return 'Success';
        } catch (error) {
            this.fileHandlerService.deleteFile(filePath);
            throw error
        }
    }

    async registerUser(body:loginRegisterDto) : Promise<any>{
        try {
            let alreadyUserByEmail: any = await this.repository.getUsersInfo({email: body.email},{});
            if( alreadyUserByEmail ){
                throw new ConflictException("We are sorry, we already have an active user with this eamil id. So you can not register with this one.")
            }
            // let registeredUserInfo: any = await this.repository.registerUser(body);
            // registeredUserInfo.token = 'token123';
            // return registeredUserInfo;
            return  await this.repository.registerUser(body);
        } catch (error) {
            throw(error);
        }
    }

    async loginUser(body:loginRegisterDto) : Promise<any>{
        try {
            let alreadyUserByEmail: any = await this.repository.getUsersInfo({email: body.email, password: body.password},{_id: 1, token:1});
            return alreadyUserByEmail;
        } catch (error) {
            throw(error);
        }
    }

    async getAllUsers(body: any):Promise<any>{
        try {
            return await this.repository.getAllUsers(body);
        } catch (error) {
         throw(error)
        }
    }

    async getUsersInfo(_id) : Promise<any>{
        try {
            let reqObj: any = {_id: _id };
            let usersInfo: any = await this.repository.getUsersInfo(reqObj, {fName:1, lName:1, email:1, status:1, createdOn:1, awsKey:1});
            usersInfo?.awsKey ? usersInfo.dUrl =  await this.awsS3Service.getFileObject(usersInfo.awsKey) : '';
            return usersInfo; 
        } catch ( error ) {
            throw(error);
        }
    }

    async deleteUsersProfile(id): Promise<any>{
        try {
            return await this.repository.deleteUsersProfile(id);
        } catch (error) {
            throw(error);
        }
    }

    async updateUsersInfo(id, body) : Promise<any>{
        try {
            return this.repository.updateUsersInfo(id, body);
        } catch (error) {
            throw(error);
        }
    }


}

import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { loginRegisterDto } from './dto/user.dto';
import { UsersSchemaName } from "./schema/user.schema"; 
import { Model } from 'mongoose'; 

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(UsersSchemaName) private readonly userModel: Model<any>,
    ){

    }

    async registerUser(reqBody: loginRegisterDto): Promise<any> {
        console.log('registerUser**', reqBody);
        let newObj : any = {};
        newObj = {
            ...{email: reqBody.email, password: reqBody.password},
            ...{token : 'abc123'}
        }
        let doc = new this.userModel(newObj);
        return await doc.save();
    }

    async getUsersInfo(reqObj: any = {}, projectionObj: any = {}) : Promise<any>{
        let query: any = {};
        query['status'] = { $nin : ['Deleted'] }
        
        query = {
            ...query,
            ...reqObj
        }

        console.log('getUsersInfo query***', query);
        console.log('getUsersInfo projectionObj***', projectionObj);
        return await this.userModel.findOne( query , projectionObj).lean().exec()
    }

    async getAllUsers(body: any):Promise<any>{
        let query: any = {};
        query['status'] = { $nin : ['Deleted'] }
        
        body.email ? query.email = {'$regex' : (body.email).trim(), '$options' : 'i'} : '';
        body.fName ? query.fName = {'$regex' : (body.fName).trim(), '$options' : 'i'} : '';
 
        let projectionObj: any = {fName:1, lName:1, email:1, createdOn:1}; 
        return await this.userModel.find( query , projectionObj).lean().exec()
    }

    async deleteUsersProfile(id): Promise<any>{
        return await this.userModel.updateOne({ _id: id }, { $set: { status : 'Deleted' } }).exec()
    }
    async updateUsersInfo(id, body) : Promise<any>{
        let updateDataObj: any = {};
        updateDataObj.fName = body.fName;
        updateDataObj.lName = body.lName;
        updateDataObj.awsKey = body.awsKey;
        return await this.userModel.updateOne({ _id: id }, { $set: updateDataObj }).exec()
    }

}

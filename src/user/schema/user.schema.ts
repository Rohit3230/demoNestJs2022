import { Schema } from 'mongoose';

export const UsersSchema = new Schema({
    fName: { type: String }, 
    lName: { type: String },
    email: { type: String },
    status : { type : String, default : 'Active' },
    createdOn: { type: Date, default: Date.now },
    profileImage: { type : String },
    password: { type: String },
    token : { type : String },
    awsKey: { type : String }
}, { strict: true })

export const UsersSchemaName = "rsnusers";

import { Type } from "class-transformer"
import { IsMongoId, IsNotEmpty, Min, Max, Length, IsMobilePhone, IsString, IsISO8601, IsOptional, ValidateNested, IsEmail, isNotEmpty } from "class-validator"
import exp from "constants"

export class loginRegisterDto{
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: String

    @IsNotEmpty()
    @IsString()
    @Length(5, 6)
    password: String
}

export class updateUsersInfoDto{
    @IsNotEmpty()
    @IsString()
    fName : String

    @IsOptional()
    @IsString()
    lName: String   
}

export class getUsersDto{
    @IsOptional()
    @IsString()
    status : String

    @IsOptional()
    @IsString()
    name: String   
}
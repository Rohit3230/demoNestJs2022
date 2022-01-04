import { IsEnum, IsNotEmpty } from 'class-validator';

export enum FILETYPE {
    selfie = "selfie"
}

export class UploadFileDto {
    @IsNotEmpty({ message: "parameter fileType is missing" })
    @IsEnum(FILETYPE, { message: "invalid fileType" })
    fileType: FILETYPE

    @IsNotEmpty({ message: "parameter uH is missing" })
    uH: string
}
import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from "aws-sdk";

@Injectable()
export class AwsS3Service
{
    AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    s3 = new AWS.S3
    ({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        signatureVersion: 'v4',
        // region: 'S3_REGION',
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });

    // async uploadFile(file) : Promise<any>
    // {
    //     const { originalname } = file;

    //     return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
    // }

    async uploadFile(fileBuffer: any, fileMimeType:any, contentType: any, fileName:any) : Promise<any>
    {
        // const { originalname } = file;
        const { originalname } = fileName ;

        return await this.s3_upload(fileBuffer, this.AWS_S3_BUCKET, fileName, fileMimeType, contentType);
    }

    async s3_upload(file, bucket, name, mimetype, contentType):Promise<any>
    {
        // const params = 
        // {
        //     Bucket: bucket,
        //     Key: String(name),
        //     Body: file,
        //     // ACL: "public-read",
        //     ContentType: mimetype,
        //     ContentDisposition:"inline",
        //     CreateBucketConfiguration: 
        //     {
        //         LocationConstraint: "ap-south-1"
        //     }
        // }; 

        const params = {
            Bucket: bucket,
            Key: String(name), 
            Body: file,
            ContentEncoding: 'base64',
            ContentType: contentType ? contentType : 'image/jpeg',
            CreateBucketConfiguration: 
            {
                LocationConstraint: "ap-south-1"
            }
          };

        console.log('s3_upload****',params);

        try
        {
            let s3Response = await this.s3.upload(params).promise();

            console.log('s3Response****',s3Response);

            return s3Response;
        }
        catch (e)
        {
            console.log('s3Response error****',e);
            throw(e);
        }
    }


    async getFileObject(keyName:any) : Promise<any>{
        try {
            // const params = {
            //     Bucket: this.AWS_S3_BUCKET,
            //     Key: keyName
            //   };
            //   return await this.s3.getObject(params).promise();
            const signedUrlExpireSeconds = 60 * 60 
            const url = await this.s3.getSignedUrl('getObject', {
                Bucket: this.AWS_S3_BUCKET,
                Key: keyName,
                Expires: signedUrlExpireSeconds
            });
            return url;
        } catch (e) {
            throw(e);
        }
    }

    async deleteFileObject(keyName:any) : Promise<any>{
        try {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Key: keyName
              };
              return await this.s3.deleteObject(params).promise();
        } catch (e) {
            throw(e);
        }
    }
}
import { Injectable, InternalServerErrorException, ServiceUnavailableException } from "@nestjs/common";
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path'; 
import * as https from 'https';

const options = {
    saveFilename: "untitled",
    savePath: ".",
    format: "png",
    width: 1500,
    height: 2000,
    density: 330,
  };

@Injectable()
export class FileHandlerService {
    private uploadPath = path.resolve(path.join(__dirname, '../../../../upload/')) + '/';

    constructor(
        // private httpService: HttpService
        ) {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath)
        }
    }

    generateFileName(fileType, contentType) {
        console.log("contentType %s", contentType);
        console.log('contentType.split("/")[1] ', contentType.split("/")[1]);
        return fileType + '-' + new Date().getTime() + '-' + Math.floor(Math.random() * 10000) + '.' + contentType.split("/")[1]
    }

    uploadFile(req: Request, fileType: string, contentType: string): Promise<string> {
        const filePath = path.join(this.uploadPath + this.generateFileName(fileType, contentType))
        return new Promise((res, rej) => {
            const ws = fs.createWriteStream(filePath);
            req.pipe(ws);
            req.on('end', () => {
                res(filePath)
            })
            ws.on('error', (error) => {
                console.error(error)
                rej(new InternalServerErrorException(error))
            })
        })
    } 

    downloadFile(uri: string, fileType: string, contentType: string): Promise<string> {
        const filePath = path.join(this.uploadPath + this.generateFileName(fileType, contentType))
        return new Promise((resolve, rej) => {
            const ws = fs.createWriteStream(filePath);
            https.get(uri, (res) => {
                res.pipe(ws);
                ws.on('finish', () => {
                    ws.close();
                    console.log('Download Completed', filePath);
                    resolve(filePath);
                })
            })
    
            ws.on('error', (error) => {
                console.error(error)
                rej(new InternalServerErrorException(error))
            })
        })
    }
     

    async fileToBase64(filePath): Promise<string> { 
        let base64_1  = await this.getFilePathToBase64(filePath);
        let base64_2  = await this.getFilePathToBase64(filePath); 
        if(
            base64_1 == base64_2
        ){ 
            return base64_1;
        }else{
            let base64_3  = await this.getFilePathToBase64(filePath); 
            if(
                base64_1 == base64_3
            ){ 
                return base64_1;
            } else if (
                base64_2 == base64_3
            ){ 
                return base64_2;
            }else{ 
                return base64_3;
            }
        }
    }

    async getFilePathToBase64(filePath): Promise<string> {
        return new Promise((res, rej) => { 
            fs.readFile(filePath, { encoding: "base64" }, (err, data) => {
                if (err) {
                    console.log("fail to process file");
                    rej(err);
                } else {
                    res(data);
                };
            })
        })
    }
 

    deleteFile(filePath) {
        if (filePath) {
            fs.unlinkSync(filePath);
        }
    }
       
}
import type { FileType, S3ParamsType, S3ReturnType } from '../types';
import type { ManagedUpload } from 'aws-sdk/clients/s3';
import aws from 'aws-sdk';
import fs from 'fs';
import moment from 'moment';

aws.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new aws.S3({
  apiVersion: '2006-03-01',
});

async function uploadImage(file: FileType): Promise<S3ReturnType> {
  return new Promise((resolve, reject) => {
    const Params: S3ParamsType = {
      Bucket: 'image.paysys.kr',
      Body: fs.createReadStream(file.path),
      Key: `${moment().format('YYMMDD_HHmmss')}_${file.name.trim()}`,
      ContentType: file.type,
    };

    Params.Body.on('error', (err) => {
      reject(err);
    });

    s3.upload(Params, (err: Error, data: ManagedUpload.SendData) => {
      if (err) {
        reject(err);
      } else if (data) {
        resolve({
          key: data.Key,
          url: data.Location,
        });
      }
    });
  });
}

export default uploadImage;

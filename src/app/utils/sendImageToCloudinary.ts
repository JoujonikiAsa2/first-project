import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

// Configuration
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api_key,
  api_secret: config.cloud_api_secret, // Click 'View API Keys' above to copy your API secret
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
          // Delete file named 'exampleFile.txt'
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('File deleted successfully!');
            }
          });
        }
      },
    );
  });
};

//multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

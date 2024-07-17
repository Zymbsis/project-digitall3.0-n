import cloudinary from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';
import fs from 'node:fs/promises';
import { saveFileToUploadDir } from './saveFileToUploadDir.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    const response = await cloudinary.v2.uploader.upload(file.path);
    await fs.unlink(file.path);
    return response.secure_url;
  } catch {
    return await saveFileToUploadDir(file);
  }
};

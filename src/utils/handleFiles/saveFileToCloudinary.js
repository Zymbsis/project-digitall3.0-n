import cloudinary from 'cloudinary';
import { env } from '../env.js';
import { ENV_VARS } from '../../constants/index.js';
import fs from 'node:fs/promises';
import { saveFileToUploadDir } from './saveFileToUploadDir.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(ENV_VARS.CLOUD_NAME),
  api_key: env(ENV_VARS.API_KEY),
  api_secret: env(ENV_VARS.API_SECRET),
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

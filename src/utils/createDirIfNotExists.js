import { access, mkdir } from 'node:fs/promises';

export const createDirIfNotExists = async (path) => {
  try {
    await access(path);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await mkdir(path);
    }
  }
};

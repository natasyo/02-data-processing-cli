import path from 'path';
import { stat } from 'fs/promises';
import fs from 'fs';
import crypto from 'crypto';
import { pathResolver } from '../utils/pathResolver.js';
export async function decrypt(currentPath, args) {
  return new Promise(async (resolve) => {
    try {
      const inputIdx = args.indexOf('--input');
      const outputIdx = args.indexOf('--output');
      const passIdx = args.indexOf('--password');
      if (inputIdx === -1 || outputIdx === -1 || passIdx === -1 || !args[passIdx + 1]) {
        console.log('Operation failed: Missing arguments or password');
        return;
      }
      const inputFile = await pathResolver(currentPath, args[inputIdx + 1]);
      const outputFile = path.join(currentPath, args[outputIdx + 1]);
      const password = args[passIdx + 1];
      if (!password) {
        console.log('Operation field password');
        return;
      }
      const statFile = await stat(inputFile);
      if (statFile.size < 44) {
        console.log('Operation failed: file too small');
        return resolve();
      }
      const fd = fs.openSync(inputFile, 'r');
      const salt = Buffer.alloc(16);
      const iv = Buffer.alloc(12);
      const authTag = Buffer.alloc(16);
      fs.readSync(fd, salt, 0, 16, 0);
      fs.readSync(fd, iv, 0, 12, 16);
      fs.readSync(fd, authTag, 0, 16, statFile.size - 16);
      fs.closeSync(fd);
      const key = crypto.scryptSync(password, salt, 32);
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      const readStream = fs.createReadStream(inputFile, {
        start: 28,
        end: statFile.size - 17,
      });
      const writeStream = fs.createWriteStream(outputFile);

      readStream
        .pipe(decipher)
        .pipe(writeStream)
        .on('finish', () => {
          console.log('Decrypted');
          resolve();
        });

      readStream.on('error', () => {
        console.log('Operation failed');
        resolve();
      });
      readStream.on('error', () => {
        console.log('Operation failed');
        resolve();
      });
    } catch (err) {
      console.log('Operation field: ', err);
      resolve();
    }
  });
}

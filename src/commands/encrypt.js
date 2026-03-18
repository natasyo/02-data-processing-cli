import { setPath } from '../navigation.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
export async function encrypt(currentPath, args) {
  return new Promise(async (resolve) => {
    try {
      const inputIdx = args.indexOf('--input');
      const outputIdx = args.indexOf('--output');
      const passIdx = args.indexOf('--password');
      if (inputIdx === -1 || outputIdx === -1 || passIdx === -1 || !args[passIdx + 1]) {
        console.log('Operation failed: Missing arguments or password');
        return;
      }
      const inputFile = await setPath(currentPath, args[inputIdx + 1]);
      const outputFile = path.join(currentPath, args[outputIdx + 1]);
      const password = args[passIdx + 1];
      console.log('Password:', password);
      if (!password) {
        console.log('Operation field password');
        return;
      }
      const salt = crypto.randomBytes(16);
      const iv = crypto.randomBytes(12);
      const key = crypto.scryptSync(password, salt, 32);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const read = fs.createReadStream(inputFile);
      const write = fs.createWriteStream(outputFile);
      write.write(salt);
      write.write(iv);
      read
        .pipe(cipher)
        .pipe(write)
        .on('finish', () => {
          const authTag = cipher.getAuthTag();
          fs.appendFileSync(outputFile, authTag);
          console.log('Encrypted');
          resolve();
        });
      write.on('error', (err) => {
        console.error('Operation failed: ', err);
        resolve();
      });
      read.on('error', (err) => {
        console.error('Operation failed: ', err);
        resolve();
      });
    } catch (e) {
      console.log('Operation field');
      console.error(e.message);
      resolve();
    }
  });
}

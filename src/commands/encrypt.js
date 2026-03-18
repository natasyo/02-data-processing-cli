import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { pathResolver } from '../utils/pathResolver.js';
import { argParser } from '../utils/argParser.js';
export async function encrypt(currentPath, args) {
  return new Promise(async (resolve) => {
    try {
      const { input, output, password } = argParser(args);
      if (!input || !output || !password) {
        console.log('Operation failed: Missing arguments or password');
        return;
      }

      const inputFile = await pathResolver(currentPath, input);
      const outputFile = path.join(currentPath, output);
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

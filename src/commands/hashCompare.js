import fs from 'fs';
import crypto from 'crypto';
import { pathResolver } from '../utils/pathResolver.js';
import { argParser } from '../utils/argParser.js';

const algorithmList = ['sha256', 'md5', 'sha512'];
export async function hashCompare(currentPath, args) {
  return new Promise(async (resolve, reject) => {
    try {
      const { input, hash, algorithm } = argParser(args);
      if (!input || input === true || !hash || hash === true) {
        console.log('Operation failed: Missing arguments or password');
        return resolve();
      }
      const inputFile = await pathResolver(currentPath, input);
      const hashFile = await pathResolver(currentPath, hash);
      const algorithmData = algorithmList.indexOf(algorithm) > -1 ? algorithm : 'sha256';
      const hashData = crypto.createHash(algorithmData);
      const hashFileData = fs
        .readFileSync(hashFile, { encoding: 'utf8' })
        .split(':')[1]
        .trim();
      const readStream = fs.createReadStream(inputFile);
      readStream.on('data', (chunk) => {
        hashData.update(chunk);
      });

      readStream.on('end', () => {
        if (hashFileData === hashData.digest('hex')) {
          console.log('OK');
        } else {
          console.log('MISMATCH');
        }
        resolve();
      });
    } catch (e) {
      console.log('Operation field');
      console.error(e.message);
      resolve();
    }
  });
}

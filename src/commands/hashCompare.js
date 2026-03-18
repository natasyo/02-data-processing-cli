import fs from 'fs';
import crypto from 'crypto';
import { pathResolver } from '../utils/pathResolver.js';

const algorithmList = ['sha256', 'md5', 'sha512'];
export async function hashCompare(currentPath, args) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(args[args.indexOf('--input') + 1], args[args.indexOf('--hash') + 1]);
      const inputFile = await pathResolver(
        currentPath,
        args[args.indexOf('--input') + 1],
      );
      const hashFile = await pathResolver(currentPath, args[args.indexOf('--hash') + 1]);
      const algorithm = algorithmList.indexOf(args[args.indexOf('--algorithm') + 1])
        ? args[args.indexOf('--algorithm') + 1]
        : 'sha256';
      const hash = crypto.createHash(algorithm);
      const hashFileData = fs
        .readFileSync(hashFile, { encoding: 'utf8' })
        .split(':')[1]
        .trim();
      const readStream = fs.createReadStream(inputFile);
      readStream.on('data', (chunk) => {
        hash.update(chunk);
      });

      readStream.on('end', () => {
        if (hashFileData === hash.digest('hex')) {
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

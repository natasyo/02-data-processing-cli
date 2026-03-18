import crypto from 'crypto';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { pathResolver } from '../utils/pathResolver.js';
import { argParser } from '../utils/argParser.js';
import { Transform } from 'stream';

export async function hash(currentPath, args) {
  return new Promise((resolve) => {
    const algorithmList = ['sha256', 'md5', 'sha512'];
    (async () => {
      try {
        let algorithmType = 'sha256';
        const { algorithm, input, save } = argParser(args);
        if (!input || input === true) {
          console.log('Operation failed: Missing arguments or password');
          return resolve();
        }
        const inputFile = await pathResolver(currentPath, input);
        if (algorithmList.indexOf(algorithm) > -1) {
          algorithmType = algorithm;
        }
        const hash = crypto.createHash(algorithmType);
        const hashStream = new Transform({
          transform(chunk, encoding, callback) {
            hash.update(chunk);
            return callback(null, chunk);
          },
        });
        const readStream = fs.createReadStream(inputFile, {
          highWaterMark: 1024 * 1024,
        });
        readStream
          .pipe(hashStream)
          .on('finish', async () => {
            const output = `${algorithmType} : ${hash.digest('hex')}`;
            if (save) {
              const pathFile = `${path.join(inputFile, '..', path.basename(inputFile))}.${algorithmType}`;
              console.log(pathFile);
              await writeFile(pathFile, output);
            }
            resolve();
          })
          .on('error', (err) => {
            console.log('Operation failed', err);
            resolve();
          });
      } catch (e) {
        console.log('Operation field');
        resolve();
      }
    })();
  });
}

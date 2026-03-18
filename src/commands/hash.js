import { setPath } from '../navigation.js';
import crypto from 'crypto';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { pathResolver } from '../utils/pathResolver.js';

export async function hash(currentPath, args) {
  if (args.length < 2) throw new Error('Operation field;');

  const inputIndex = args.indexOf('--input');
  const algorithmList = ['sha256', 'md5', 'sha512'];
  try {
    if (inputIndex < 0) throw new Error('Operation field;');
    const inputFile = await pathResolver(currentPath, args[inputIndex + 1]);
    let algorithm = 'sha256';
    const indexAlgorithm = args.indexOf('--algorithm');
    if (indexAlgorithm > -1) {
      if (
        args.length >= indexAlgorithm + 2 &&
        algorithmList.indexOf(args[indexAlgorithm + 1]) > -1
      ) {
        algorithm = args[indexAlgorithm + 1];
      } else {
        throw new Error('Error: Algorithm field.');
      }
    }
    const hash = crypto.createHash(algorithm);
    const readStream = fs.createReadStream(inputFile);
    readStream.on('data', (chunk) => {
      hash.update(chunk);
    });
    readStream.on('end', async () => {
      const output = `${algorithm} : ${hash.digest('hex')}`;
      console.log(output);
      if (args.indexOf('--save') > -1) {
        const pathFile = `${path.join(inputFile, '..', path.basename(inputFile))}.${algorithm}`;
        console.log(pathFile);
        await writeFile(pathFile, output);
      }
    });
  } catch (e) {
    console.log('Operation field');
  }
}

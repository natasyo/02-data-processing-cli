import { createReadStream } from 'fs';
import { pathResolver } from '../utils/pathResolver.js';
import { argParser } from '../utils/argParser.js';

export async function count(currentPath, args) {
  return new Promise((resolve) => {
    (async () => {
      const { input } = argParser(args);
      if (!input || input === true)
        throw new Error('Error: count command argument format: --input file.txt');
      try {
        const inputFile = await pathResolver(currentPath, input);
        const stream = createReadStream(inputFile, 'utf8');
        let buffer = '';
        let lines = 0;
        let words = 0;
        stream.on('data', (chunk) => {
          buffer += chunk;
          const parts = buffer.split('\n');
          lines += parts.length;
          words += parts.join(' ').trim().split('\s+').length;
          buffer = buffer.split(' ').pop();
        });
        stream.on('end', () => {
          console.log(`Lines: ${lines}`);
          console.log(`Words: ${words}`);
          resolve();
        });
        stream.on('error', (err) => {
          console.error('Error reading file:', err);
          resolve();
        });
      } catch {
        console.log('Operation field;');
        resolve();
      }
    })();
  });
}

import { createReadStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';

export async function count(currentPath, args) {
  if (args.length < 2)
    throw new Error('Error: count command argument format: --input file.txt');

  const inputIndex = args.indexOf('--input');
  if (inputIndex < 0)
    throw new Error('Error: count command argument format: --input file.txt');
  try {
    const inputFile = path.join(currentPath, args[inputIndex + 1]);
    const stream = createReadStream(inputFile, 'utf8');
    let buffer = '';
    let lines = 0;
    let words = 0;
    stream.on('data', (chunk) => {
      buffer += chunk;
      lines += chunk.split('\n').length;
      words += chunk.replace(/[^\w\s]/g, '').replace(/\n\s+/g, ' ').length;
      buffer = buffer.split(' ').pop();
    });
    stream.on('end', () => {
      console.log(`Lines: ${lines}`);
      console.log(`Words: ${words}`);
    });
    stream.on('error', (err) => {
      console.error('Error reading file:', err);
    });
  } catch {
    console.log('Operation field;');
  }
}

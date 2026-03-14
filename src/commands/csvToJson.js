import fs from 'fs/promises';
import { createReadStream, writeFile } from 'fs';
import path from 'path';
import {  Transform, Writable, pipeline } from 'stream';
export async function csvToJson(currentPath, args) {
  if (args.length !== 4)
    throw new Error(
      'Error: csvToJson command argument format: --input data.csv --output data.json'
    );
  const inputIndex = args.indexOf('--input');
  const outputIndex = args.indexOf('--output');
  if (inputIndex === -1 || outputIndex === -1) {
    throw new Error(
      'Error: csvToJson command argument format: --input data.csv --output data.json'
    );
  }
  const inputFile = path.join(currentPath, args[inputIndex + 1]);
  const outputFile = path.join(currentPath, args[outputIndex + 1]);
  try {
    await fs.access(inputFile, fs.constants.R_OK);
    const readable = createReadStream(inputFile, 'utf8');
    let text = '';
    const transform = new Transform({
      transform(chunk, encoding, callback) {
        text += chunk;
        const rows = text.split('\n');
        text = rows.pop();

        const keys = rows[0].split(',');
        const items = rows.slice(1).map((row) => {
          let obj = {};
          row.split(',').forEach((line, index) => {
            obj[keys[index]] = line;
          });
          return obj;
        });
        callback(null, JSON.stringify(items, null, 2));
      },
    });
    const writable = new Writable({
      write(chunk, encoding, callback) {
        console.log(chunk, encoding);
        try {
          writeFile(outputFile, chunk, async () => {
            await fs.writeFile(outputFile, chunk);
          });
          callback(null, chunk);
        } catch (err) {
          callback(err, null);
        }
      },
    });
    pipeline(readable, transform, writable, (err, result) => {
      if (err) {
        console.error(err);
      }
      if (result) {
        console.log('result', result);
      }
    });
  } catch (error) {
    throw error;
  }
}

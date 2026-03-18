import fs from 'fs/promises';
import { createReadStream, writeFile } from 'fs';
import path from 'path';
import { Transform, Writable, pipeline } from 'stream';
import { argParser } from '../utils/argParser.js';
import { pathResolver } from '../utils/pathResolver.js';
export async function csvToJson(currentPath, args) {
  return new Promise((resolve) => {
    (async () => {
      const { input, output } = argParser(args);

      if (!input || input === true || !output || output === true) {
        console.error(
          'Error: csvToJson command argument format: --input data.csv --output data.json',
        );
      }
      const inputFile = await pathResolver(currentPath, input);
      const outputFile = path.join(currentPath, output);
      try {
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
          resolve();
        });
      } catch (error) {
        console.error('Operation field:', error);
        resolve();
      }
    })();
  });
}

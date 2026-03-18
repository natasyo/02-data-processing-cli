import { createReadStream } from 'fs';
import path from 'path';
import { pipeline, Transform, Writable } from 'stream';
import fs from 'fs';
import { argParser } from '../utils/argParser.js';
import { pathResolver } from '../utils/pathResolver.js';
export async function jsonToCsv(currentPath, args) {
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

      const readable = createReadStream(inputFile, 'utf8');
      let buffer = '';
      const transform = new Transform({
        transform(chunk, encoding, callback) {
          try {
            buffer += chunk;
            const jsonData = JSON.parse(buffer);
            buffer = jsonData.pop();

            const headers = Object.keys(jsonData[0]);
            let result = jsonData.slice(1).map((row) => {
              return Object.values(row).join(',');
            });
            result.unshift(headers.join(','));
            callback(null, result.join('\n'));
          } catch (error) {
            callback(error, null);
          }
        },
      });

      const writer = new Writable({
        write(chunk, encoding, callback) {
          try {
            fs.writeFileSync(outputFile, chunk);
            callback(null, 'Ok');
          } catch (error) {
            callback(error, null);
          }
        },
      });
      pipeline(readable, transform, writer, (err) => {
        if (err) console.error('\t', err.message);
        resolve();
      });
    })();
  });
}

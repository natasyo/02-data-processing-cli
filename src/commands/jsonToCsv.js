import { createReadStream } from 'fs';
import path from 'path';
import { pipeline, Transform, Writable } from 'stream';
import fs from 'fs';
export async function jsonToCsv(currentPath, args) {
  if (args.length !== 4)
    throw new Error(
      'Error: json-to-csv command argument format: --input data.csv --output data.json',
    );
  const inputIndex = args.indexOf('--input');
  const outputIndex = args.indexOf('--output');
  if (inputIndex === -1 || outputIndex === -1) {
    throw new Error(
      'Error: csvToJson command argument format: --input data.csv --output data.json',
    );
  }

  const inputFile = path.join(currentPath, args[inputIndex + 1]);
  const outputFile = path.join(currentPath, args[outputIndex + 1]);

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
  });
}

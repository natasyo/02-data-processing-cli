import path from 'path';
import fs from 'fs/promises';

export async function hash(currentPath, args) {
  if (args.length < 2) throw new Error('Operation field;');

  const inputIndex = args.indexOf('--input');
  if (inputIndex < 0) throw new Error('Operation field;');
  const inputFile = path.join(currentPath, args[inputIndex + 1]);
  let algorithm = 'sha256';
  const indexAlgorithm = args.indexOf('--algorithm');
  if (indexAlgorithm > 0) {
    if (args.length < indexAlgorithm + 2) throw new Error('Operation field;');
    algorithm = args[indexAlgorithm + 1];
  }
  console.log(algorithm);
  try {
    await fs.access(inputFile);
  } catch (e) {
    console.log(e.message);
  }
}

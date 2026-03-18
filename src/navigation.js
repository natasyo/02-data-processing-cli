// navigation.js    — navigation commands (up, cd, ls)
import path from 'path';
import fs from 'fs/promises';
import { pathResolver } from './utils/pathResolver.js';
export function up(directoryPath) {
  const newPath = path.join(directoryPath, '..');
  console.log(newPath);
  return newPath;
}

export async function cd(directoryPath, args) {
  console.log(directoryPath);
  if (args.length <= 0) {
    console.log('Error command: cd');
    return;
  }
  const newPath = await pathResolver(directoryPath, args[0]);
  console.log(newPath);
  return newPath;
}

export async function ls(directoryPath) {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });
  files.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;

    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  files.forEach((file) => {
    console.log(file.name.padEnd(20), `[${file.isDirectory() ? 'folder' : 'file'}]`);
  });
}

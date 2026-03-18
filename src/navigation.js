// navigation.js    — navigation commands (up, cd, ls)
import path from 'path';
import fs from 'fs/promises';
export function up(directoryPath) {
  const newPath = path.join(directoryPath, '..');
  console.log(newPath);
  return newPath;
}
export async function setPath(directoryPath,newPath) {
    if (path.isAbsolute(newPath)) {
    try {
      await fs.access(newPath);
      return newPath;
    } catch (err) {
      console.error(err.message);
    }
  } else {
    try {
      const fullPath = path.join(directoryPath, newPath);
      await fs.access(fullPath);
      return fullPath;
    } catch (err) {
      console.error(err.message);
    }
  }
}

export async function cd(directoryPath, args) {
  console.log(directoryPath);
  if (args.length <= 0) {
    console.log('Error command: cd');
    return;
  }
  const newPath=await setPath(directoryPath,args[0]);
  console.log(newPath)
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

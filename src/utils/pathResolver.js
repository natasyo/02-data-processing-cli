import path from 'path';
import fs from 'fs/promises';
export async function pathResolver(directoryPath, newPath) {
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

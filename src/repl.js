import { stdin, stdout } from 'process';
import readline from 'readline';
import { cd, ls, up } from './navigation.js';
import { csvToJson } from './commands/csvToJson.js';
import { jsonToCsv } from './commands/jsonToCsv.js';
import { count } from './commands/count.js';
import { hash } from './commands/hash.js';
import { hashCompare } from './commands/hashCompare.js';
import { encrypt } from './commands/encrypt.js';

function parseCommandLine(line) {
  const [command, ...args] = line.split(' ');
  return { command, args };
}

export async function repl() {
  let currentPath = process.cwd();
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    prompt: '\n> ',
  });
  rl.prompt();
  rl.on('line', async (input) => {
    try {
      const { command, args } = parseCommandLine(input);
      parseCommandLine(input);
      switch (command) {
        case 'up':
          currentPath = up(currentPath);
          break;
        case 'cd':
          currentPath = await cd(currentPath, args);
          break;
        case 'ls':
          await ls(currentPath);
          break;
        case 'csv-to-json':
          await csvToJson(currentPath, args);
          break;
        case 'json-to-csv':
          await jsonToCsv(currentPath, args);
          break;
        case 'count':
          await count(currentPath, args);
          break;
        case 'hash':
          await hash(currentPath, args);
          break;
        case 'hash-compare':
          await hashCompare(currentPath, args);
          break;
        case 'encrypt':
          await encrypt(currentPath, args);
          break;
        default:
          console.log('Unknown command: ' + command);
          break;
      }
      console.log('\n', currentPath);
      rl.prompt();
    } catch (error) {
      console.error(error.message);
      rl.prompt();
    }
  });

  rl.on('close', () => {
    console.log('close');
  });
}

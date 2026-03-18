import { repl } from './repl.js';

async function main() {
  console.log('Welcome to Data Processing CLI!');
  console.log('You are currently in ', process.cwd());
  await repl();
}

await main();

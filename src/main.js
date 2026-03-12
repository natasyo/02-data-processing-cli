import { stdin, stdout } from "process";
import readline from "readline";
import { repl } from "./repl.js";

function main() {
  console.log("Welcome to Data Processing CLI!");
  console.log("You are currently in ", process.cwd());
  repl();
}

main();

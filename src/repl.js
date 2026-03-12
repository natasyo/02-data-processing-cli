import { stdin, stdout } from "process";
import readline from "readline";
export function repl() {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    prompt: ">",
  });
  rl.prompt();
  rl.on("line", (input) => {
    console.log(input);
    rl.prompt();
  });

  rl.on("close", () => {
    console.log("close");
  });
}

import { createInterface } from "node:readline";
import { styleText } from "node:util";
import { agent } from "./ai/agent.js";


const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: styleText(['bold', 'green'], ') > ')
});

process.stdout.write(styleText(['bold', 'green'], 'Welcome to AI Assistant!') + '\n');
process.stdout.write('How can I help you today?\n');

rl.prompt();

rl.on('line', async (line) => {
    try {
        const message = {
            role: 'user',
            content: line,
        };
        const res = await agent.run(message);

        process.stdout.write(`${res}\n`); 
    } catch(error) {

        process.stdout.write(`(( Error: ${error.message}\n`);
        process.stdout.write(error);
    }
    rl.prompt();
});

import { ai } from "./ai.js";
import { memory } from "./memory.js";
import { tools } from "./tools.js";

const MAX_STEPS = 10;

export const agent = {
    async run(prompt) {
        await memory.save([prompt]);

        const toolsMeta = Object.values(tools).map((tool) => tool.meta);

        for(let step = 0; step < MAX_STEPS; step++) {
            const messages = await memory.get();

            const { content, tools: toolsCall, originalItems } = await ai.ask(messages, toolsMeta);

            await memory.save(originalItems);

            if(toolsCall.length === 0) {
                console.log('content', content)
                return content;
            }

            for(const tool of toolsCall) {
                const output = await tools[tool.name].execute(tool.args);
                await memory.save([{ type: 'function_call_output', call_id: tool.call_id, output }])
            }
        }
        
        return 'Limit, try again';
    }
}
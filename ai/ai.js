const API_URL = process.env.API_URL;
const AI_MODEL = process.env.AI_MODEL;
const API_KEY = process.env.API_KEY;

export const ai = {
    async ask(messages, tools = []) {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: AI_MODEL,
                input: messages,
                tools
            })
        });

        const data = await res.json();
        if(!res.ok) throw new Error(data.error?.message ?? `HTTP ${res.status}`);

        return {
            role: 'assistant',
            content: data.output
                .filter((item) => item.type === 'message')
                .flatMap((item) => item.content)
                .filter((part) => part.type === 'output_text')
                .map((part) => part.text)
                .join(''),
            tools: data.output
                .filter((item) => item.type === 'function_call')
                .map((item) => ({ call_id: item.call_id, name: item.name, args: JSON.parse(item.arguments) })),
            originalItems: data.output
        };
    }
}

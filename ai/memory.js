import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SESSIONS_DIR = 'session';

const SESSION_FILE = join(SESSIONS_DIR, `session-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`);

export const memory = {
    _memory: [],
    async save(messages) {
        this._memory.push(...messages);

        await mkdir(SESSIONS_DIR, { recursive: true });
        await appendFile(SESSION_FILE, messages.map((message) => JSON.stringify(message) + '\n').join(''))
    },
    async get() {
        return [...this._memory];
    }
};
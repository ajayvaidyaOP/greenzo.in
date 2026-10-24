import { getDb, seedIfEmpty } from './database.js';

const db = getDb();
const reset = process.argv.includes('--reset');
const result = seedIfEmpty(db, reset);
console.log('[Greenzo DB] Ready:', result);

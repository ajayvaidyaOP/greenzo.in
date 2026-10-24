import { getDb, seedIfEmpty } from '../backend/src/db/database.js';

const db = getDb();
const reset = process.argv.includes('--reset');
const status = seedIfEmpty(db, reset);
console.log('🌿 Greenzo Database Seed Complete:', status);

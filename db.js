import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sqlite3.verbose();

const db = new sqlite3.Database('./guild_settings.db');

export function getGuildSettings(guildId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM guild_settings WHERE guild_id = ?', [guildId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function runMigration() {
    const migrationPath = path.join(__dirname, 'migrations', '001_create_guild_settings.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    db.run(migrationSQL, err => {
        if (err) {
            console.error('Migration failed:', err);
        } else {
            console.log('Migration ran successfully or was skipped if table exists.');
        }
    });
}

runMigration();

export default db;

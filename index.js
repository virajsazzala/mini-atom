import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN is not set in environment variables.');
    process.exit(1);
}

if (!process.env.DISCORD_CLIENT_ID) {
    console.error('DISCORD_CLIENT_ID is not set in environment variables.');
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

async function loadCommands() {
    const commandsPath = path.join(__dirname, 'discord', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const { default: command } = await import(`file://${filePath}`);
        client.commands.set(command.data.name, command);
    }
}

async function loadEvents() {
    const eventsPath = path.join(__dirname, 'discord', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const { default: event } = await import(`file://${filePath}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

async function main() {
    await loadCommands();
    await loadEvents();
    await client.login(process.env.DISCORD_TOKEN);
}

main();

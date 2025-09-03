# Mini Atom

A minimal Discord bot demonstrating clean structure, channel and role bindings by ID, and per-guild settings using SQLite.

## Features

- Split commands and events in separate folders.
- Bind stats channel, leaderboard channel, and admin role by ID.
- Graceful degradation if bound channels/roles are deleted.
- Simple `/bind`, `/status`, `/leaderboard`, and `/ping-stats` commands.
- Stores settings in a local SQLite database with a migration.
- Secrets handled via `.env` with startup validation.
- ESLint and Prettier configured for code quality.
- GitHub Actions runs lint on pull requests and pushes.

## Setup & Run

1. Install Dependencies

```sh
npm ci
```

2. Create `.env` with your Discord bot token and client ID

```
DISCORD_TOKEN=your-token
DISCORD_CLIENT_ID=your-client-id
```

3. Start the bot

```sh
npm start
```

### Commands

```
/bind <resource> <#channel|@role> — Bind a resource by ID.

/status — Show current bindings and their health.

/leaderboard — Post fake leaderboard data to bound channel.

/ping-stats — Posts “pong” to stats channel if bound.
```

## Notes

- Binding admin role restricts admin commands to that role.
- If no admin role is bound, users with Discord Administrator permission can bind it.
- The database migration is idempotent; safe to run multiple times.
- The bot logs warnings instead of crashing if bound entities are missing.

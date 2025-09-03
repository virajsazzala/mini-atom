CREATE TABLE IF NOT EXISTS guild_settings (
  guild_id TEXT PRIMARY KEY,
  stats_channel_id TEXT,
  leaderboard_channel_id TEXT,
  admin_role_id TEXT,
  updated_at TEXT
);

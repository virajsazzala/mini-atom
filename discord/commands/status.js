import { SlashCommandBuilder } from 'discord.js';
import db from '../../db.js';

export default {
  data: new SlashCommandBuilder().setName('status').setDescription('Show current bindings'),
  async execute(interaction) {
    db.get('SELECT * FROM guild_settings WHERE guild_id=?', [interaction.guildId], async (err, row) => {
      if (!row) {
        return interaction.reply({ content: 'No bindings set up yet.', ephemeral: true });
      }
      let statusMsg = '';
      const guild = interaction.guild;
      const statsCh = row.stats_channel_id ? guild.channels.cache.get(row.stats_channel_id) : null;
      const leaderboardCh = row.leaderboard_channel_id ? guild.channels.cache.get(row.leaderboard_channel_id) : null;
      const adminRole = row.admin_role_id ? guild.roles.cache.get(row.admin_role_id) : null;

      statusMsg += `Stats Channel: ${statsCh ? `<#${statsCh.id}> (Healthy)` : 'Missing/Deleted'}\n`;
      statusMsg += `Leaderboard Channel: ${leaderboardCh ? `<#${leaderboardCh.id}> (Healthy)` : 'Missing/Deleted'}\n`;
      statusMsg += `Admin Role: ${adminRole ? `<@&${adminRole.id}> (Healthy)` : 'Missing/Deleted'}\n`;

      return interaction.reply({ content: statusMsg, ephemeral: true });
    });
  }
};

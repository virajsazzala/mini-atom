import { SlashCommandBuilder } from 'discord.js';
import db from '../../db.js';

export default {
    data: new SlashCommandBuilder().setName('leaderboard').setDescription('Post a fake leaderboard!'),
    async execute(interaction) {
        db.get('SELECT leaderboard_channel_id FROM guild_settings WHERE guild_id=?', [interaction.guildId], async (err, row) => {
            if (!row || !row.leaderboard_channel_id) {
                return interaction.reply({ content: 'No leaderboard channel bound.', ephemeral: true });
            }
            const channel = interaction.guild.channels.cache.get(row.leaderboard_channel_id);
            if (!channel) {
                return interaction.reply({ content: 'Leaderboard channel is missing or deleted.', ephemeral: true });
            }

            // mock leaderboard data
            const leaderboard = [
                { name: 'user1', points: 100 },
                { name: 'user2', points: 80 }
            ];

            let text = '**Leaderboard:**\n';
            leaderboard.forEach((user, idx) => {
                text += `${idx + 1}. ${user.name}: ${user.points} pts\n`;
            });
            channel.send(text);
            interaction.reply({ content: 'Leaderboard posted!', ephemeral: true });
        });
    }
};

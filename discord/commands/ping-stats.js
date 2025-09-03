import { SlashCommandBuilder } from 'discord.js';
import db from '../../db.js';


export default {
    data: new SlashCommandBuilder().setName('ping-stats').setDescription('Ping the stats channel!'),
    async execute(interaction) {
        db.get('SELECT stats_channel_id FROM guild_settings WHERE guild_id=?', [interaction.guildId], async (err, row) => {
            if (!row || !row.stats_channel_id) {
                return interaction.reply({ content: 'No stats channel bound.', ephemeral: true });
            }
            const channel = interaction.guild.channels.cache.get(row.stats_channel_id);
            if (!channel) {
                return interaction.reply({ content: 'Stats channel missing or deleted.', ephemeral: true });
            }
            channel.send('pong');
            interaction.reply({ content: 'Pong sent in stats channel!', ephemeral: true });
        });
    }
};

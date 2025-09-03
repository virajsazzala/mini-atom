import { SlashCommandBuilder } from 'discord.js';
import { getGuildSettings } from '../../db.js';
import db from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('bind')
        .setDescription('Bind a resource to a channel or role')
        .addStringOption(option =>
            option.setName('resource')
                .setDescription('Resource to bind').setRequired(true)
                .addChoices(
                    { name: 'stats_channel', value: 'stats_channel_id' },
                    { name: 'leaderboard_channel', value: 'leaderboard_channel_id' },
                    { name: 'admin_role', value: 'admin_role_id' }
                ))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to bind'))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role to bind')),
    async execute(interaction) {
        const resource = interaction.options.getString('resource');
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');

        if (!channel && !role) {
            return interaction.reply({ content: 'You must specify either a channel or a role to bind.', ephemeral: true });
        }

        let value = channel ? channel.id : role.id;

        const row = await getGuildSettings(interaction.guildId);
        const adminRoleId = row ? row.admin_role_id : null;
        const adminRole = adminRoleId ? interaction.guild.roles.cache.get(adminRoleId) : null;

        if (!adminRoleId || !adminRole) {
            if (!interaction.member.permissions.has('Administrator')) {
                return interaction.reply({ content: 'Only server admins can bind resources until an admin role is set.', ephemeral: true });
            }
        } else {
            if (!interaction.member.roles.cache.has(adminRoleId)) {
                return interaction.reply({ content: 'You do not have permission to bind resources. Admin role required.', ephemeral: true });
            }
        }


        db.run(`
            INSERT INTO guild_settings (guild_id, ${resource}, updated_at)
            VALUES (?, ?, datetime('now'))
            ON CONFLICT(guild_id) DO UPDATE SET
            ${resource}=excluded.${resource}, updated_at=datetime('now')
            `, [interaction.guildId, value]);
        return interaction.reply({
            content: `${resource.replace('_id', '')} bound successfully.`, ephemeral: true
        });
    }
};
export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Error processing command.', ephemeral: true });
    }
  }
};

const { Collection, PermissionBitField } = require('discord.js');
const client = require('..');

client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName);
    if (interaction.type == 4 && command.autocomplete) {
        const choices = [];
        await command.autocomplete(interaction, choices);
    }

    if (!interaction.type == 2) return;
    if (!command) return client.commands.delete(interaction.commandName);

    try {
        if (command.userPerms || command.botPerms) {
            if (!interaction.memberPermissions.has(PermissionBitField.resolve(command.userPerms || []))) return interaction.reply(client.embeds.fail(`You don't have \`${command.userPerms}\` permissions.`));
            if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionBitField.resolve(command.botPerms || []))) return interaction.reply(client.embeds.fail(`I don't have \`${command.botPerms}\` permissions.`));
        }
        await command.run(client, interaction);
    } catch (e) {
        console.log(e);
        return interaction.reply(client.embeds.error);
    }

});
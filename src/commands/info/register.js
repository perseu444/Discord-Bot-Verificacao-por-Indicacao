const { ApplicationCommandType, Discord } = require('discord.js');
const User = require('../../models/User');
require('dotenv').config();

const ownerId = process.env.OWNER_ID;

module.exports = {
  name: 'register',
  description: 'Comando para registrar um novo usuário',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Mencione um usuário para ser expulso.",
      type: 6,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: 'Você não tem permissão para usar este comando.' });
    }

    const mentionedUser = interaction.options.getUser('user')

    let user = await User.findOne({ userId: mentionedUser.id });
    if (user) {
      return interaction.reply({ content: 'Este usuário já está registrado.' });
    }

    
    user = new User({
      userId: mentionedUser.id,
      username: mentionedUser.username,
      points: 0,
    });

    
    await user.save();

    return interaction.reply({ content: `Usuário ${mentionedUser.tag} registrado com sucesso.` });
  },
};

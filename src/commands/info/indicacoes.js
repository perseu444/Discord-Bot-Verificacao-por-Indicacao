const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
require('dotenv').config();

const ownerId = process.env.OWNER_ID;

module.exports = {
  name: 'indicacoes',
  description: 'Comando para exibir a lista de indicações dos usuários',
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: 'Você não tem permissão para usar este comando.' });
    }

    try {
      
      const users = await User.find();

      
      const embed = new EmbedBuilder()
        .setTitle('Lista de Indicações')
        .setColor('#00b0f4')
        .setTimestamp()

      
      for (const user of users) {
        embed.addFields({ name: 'Usuário', value: `\`\`\`${user.username}\`\`\``, inline: true }),
        embed.addFields({ name: 'Indicações', value: `\`\`\`${user.points}\`\`\``, inline: true }),
        embed.addFields({ name: '\u200b', value: '\u200b', inline: true }); 
      }

      
      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return interaction.reply({ content: 'Ocorreu um erro ao buscar os usuários.' });
    }
  },
};

const { ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
require('dotenv').config();

process.on('uncaughtException', (error, origin) => {
  console.log(`🚫 Erro Detectado:]\n\n${error.stack}`);
});

const ownerId = process.env.OWNER_ID;
const verifyChannel = process.env.VERIFY_CHANNEL;
const verifiedRole = process.env.VERIFIED_ROLE;
console.log(verifiedRole)


module.exports = {
  name: 'setup',
  description: 'Commando para setar o select menu de verificação',
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    let selectedUser;

    const channel = await client.channels.fetch(verifyChannel);

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: 'Você não tem permissão para usar este comando.' })
    }

    const users = await User.find();

    const selectMenuOptions = users.map(user => ({
      label: user.username,
      value: user.userId

    }));

    const ActionRowComponent = new ActionRowBuilder().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('verify-options')
        .setOptions(selectMenuOptions)
    )

    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
    });

    collector.on('collect', async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        await interaction.deferReply({ ephemeral: true });
        const selectedUserId = interaction.values[0];
        selectedUser = users.find(user => user.userId === selectedUserId);

        if (!selectedUser) {
          return interaction.reply(`Usuário não encontrado.`);
        }

        try {

          const guild = interaction.guild;
        const role = guild.roles.cache.find(role => role.id === verifiedRole);  
        const userMember = interaction.member;
        if (!role) {
          return interaction.reply('Cargo de verificação não encontrado');
        }
  
        try {
          await userMember.roles.add(role);
  
        } catch (error) {
          console.log(error);
          return interaction.reply('Ocorreu um erro ao adicionar o cargo');
        }

        selectedUser.points++;
        await selectedUser.save();
          
        } catch (error) {
          
        }

        
        await interaction.followUp('Verificado! ✅');
    
        
        return;
      }

    });

    const embed = new EmbedBuilder()
       .setTitle('VERIFICAÇÃO | Discord')
       .setDescription('Seja bem-vindo(a) ao servidor.\nPor meio de qual staff você conheceu o nosso servidor?')
       .setColor('#1fdb61')
       .setFooter({
        text: "Selecione um staff no menu abaixo."        
      })


    channel.send({ embeds: [embed], components: [ActionRowComponent.toJSON()] });

  }
}



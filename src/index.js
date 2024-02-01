require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const { Client, IntentsBitField, Partials, Collection } = require('discord.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

mongoose.connect(process.env.MONGODB);

client.commands = new Collection();

module.exports = client;

fs.readdirSync('./src/handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

client.login(process.env.BOT_TOKEN);
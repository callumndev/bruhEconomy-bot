const Discord = require('discord.js');
const bot = new Discord.Client();

const fs = require('fs');
const path = require('path');

bot.botConfig = require('../../resources/config/bruhEconomy.js');
bot.botSecrets = require('../../resources/config/secrets.js');
bot.constants = require('../../resources/config/constants.js');

bot.commands = new Discord.Collection();
bot.commandAliases = new Discord.Collection();

fs.readdir(path.resolve(__dirname, '../', 'modules', 'ClientEvents'), (err, events) => {
    if(err) return console.log('fs.readdir error:', err);

    for (let i = 0; i < events.length; i++) {
        let event = events[i].endsWith('.js') ? events[i].split('.')[0] : null;
        if(!event) continue;

        const eventFunctions = require(`../modules/ClientEvents/${event}`);

        for (let index = 0; index < eventFunctions.length; index++) {
            const eventFunc = eventFunctions[index];
            
            bot.on(event, async (...args) => {
                if(!args || args.length == 0)
                    eventFunc(bot);
                else
                    eventFunc(...args);
            });
        };
    };
});

bot.login(bot.botSecrets.botToken);

module.exports = bot;
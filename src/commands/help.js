const bruhEconomy = require('../bruhEconomy.js');
const prefix = bruhEconomy.botConfig.commandPrefix;

const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

let help = module.exports;
help.cmdConfig = {
    commandEnabled: true,
    commandName: 'help',
    commandDescription: 'Gets a list of all of {bot_username}\'s commands',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: ['h'],
    commandCategory: 'info',

    commandCooldown: {
        cooldownLength: bruhEconomy.botConfig.defaults['commandCooldown'],
        cooldownLevel: 'author',
        cooldownSaveType: 'cache'
    },

    required: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES' ]
    },

    hiddenCommand: false,
    useAliases: true
};

help.fn = async (message, args) => {
    let cmd = args[0];
    let categories = {};

    fs.readdir(path.resolve(__dirname), (err, files) => {
        if(err) return console.log('fs.readdir error [help cmd]:', err);
    
        for (let i = 0; i < files.length; i++) {
            if(!files[i].endsWith('.js')) continue;
            let command = require(`../commands/${files[i]}`).cmdConfig;
    
            if(command.commandEnabled == false) continue;
            if(command.hiddenCommand == true) continue;

            if(cmd && command.commandName.toLowerCase() == cmd.toLowerCase()) {
                let cmdNameUpper = command.commandName.charAt(0).toUpperCase() + command.commandName.slice(1);
                let partialHelpEmbed = new MessageEmbed()
                    .setTitle(`${bruhEconomy.user.username} - Help (${cmdNameUpper})`)
                    .addField('Command Name', `\`${cmdNameUpper}\``)
                    .addField('Command Description', `\`${command.commandDescription.replace(/{bot_username}/i, bruhEconomy.user.username)}\``)
                    .addField('Command Usage', `\`${command.commandUsage.replace(/{bot_prefix}/i, prefix).replace(/{commandName}/i, command.commandName)}\``)
                    .setColor('BLUE');
                
                command.commandAliases && command.useAliases ? partialHelpEmbed.addField('Command Aliases', command.commandAliases.map(alias => `\`${prefix}${alias}\``).join(', ')) : null;
                partialHelpEmbed.addField('Command Category', `\`${command.commandCategory.charAt(0).toUpperCase() + command.commandCategory.slice(1)}\``);

                return message.channel.send(partialHelpEmbed);
            };

            let commandCategory = command.commandCategory.charAt(0).toUpperCase() + command.commandCategory.slice(1);
            
            if(!categories[commandCategory]) categories[commandCategory] = [];
            categories[commandCategory].push(command);
        };

        let fullHelpEmbed = new MessageEmbed()
            .setTitle(`${bruhEconomy.user.username} - Help`)
            .setFooter(`Use ${prefix}help [command] for extra details`)
            .setColor('GREEN');

        let categoriesSorted = Object.keys(categories).sort();
        for (let i = 0; i < categoriesSorted.length; i++) {
            const category = categoriesSorted[i];
            const categoryContent = categories[category]
                .map(cmd => `**${cmd.commandName}** *-* ${cmd.commandDescription.replace(/{bot_username}/i, bruhEconomy.user.username)}`)
                    .join('\n');
                    
            fullHelpEmbed.addField(`*${category}*`, categoryContent, true);
        };

        message.channel.send(fullHelpEmbed);
    });
};
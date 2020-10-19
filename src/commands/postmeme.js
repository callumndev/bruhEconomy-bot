const bruhEconomy = require('../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');
const axios = require('axios').default;

let rob = module.exports;
rob.cmdConfig = {
    commandEnabled: true,
    commandName: 'rob',
    commandDescription: 'Rob money from another users wallet',
    commandUsage: '{bot_prefix}{commandName} [user]',
    commandAliases: null,
    commandCategory: 'criminal',

    commandCooldown: {
        cooldownLength: 5,
        cooldownLevel: 'author',
        cooldownSaveType: 'cache'
    },

    requiredPermissions: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES' ]
    },

    hiddenCommand: false,
    useAliases: false
};


rob.fn = async (message, args) => {
    let randMeme = (await axios('https://some-random-api.ml/meme')).data;
    
    let memeEmbed = new MessageEmbed()
        .setTitle(`${bruhEconomy.user.username} - Meme`)
        .setDescription(randMeme.caption)
        .setImage(randMeme.image)
        .setFooter(`Category: ${randMeme.category}`)
        .setColor('GREEN');
        
    return message.channel.send(memeEmbed);
};
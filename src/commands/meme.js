const bruhEconomy = require('../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');
const axios = require('axios').default;

let meme = module.exports;
meme.cmdConfig = {
    commandEnabled: true,
    commandName: 'meme',
    commandDescription: 'Sends a random meme',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: null,
    commandCategory: 'fun',

    commandCooldown: {
        cooldownLength: 5,
        cooldownLevel: 'author',
        cooldownSaveType: 'cache'
    },

    required: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES' ]
    },

    hiddenCommand: false,
    useAliases: false
};


meme.fn = async (message, args) => {
    let randMeme = (await axios('https://some-random-api.ml/meme')).data;
    
    let memeEmbed = new MessageEmbed()
        .setTitle(`${bruhEconomy.user.username} - Meme`)
        .setDescription(randMeme.caption)
        .setImage(randMeme.image)
        .setFooter(`Category: ${randMeme.category}`)
        .setColor('GREEN');
        
    return message.channel.send(memeEmbed);
};
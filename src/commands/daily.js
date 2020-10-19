const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

const formatNum = require('../../resources/scripts/formatNum.js');

let daily = module.exports;
daily.cmdConfig = {
    commandEnabled: true,
    commandName: 'daily',
    commandDescription: 'Get some quick daily money...',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: null,
    commandCategory: 'economy',

    commandCooldown: {
        cooldownLength: 86400,
        cooldownLevel: 'author',
        cooldownSaveType: 'db'
    },

    required: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES' ]
    },

    hiddenCommand: false,
    useAliases: false
};

daily.fn = async (message, args) => {
    let dailyMoney = 1000;
    let addAuthorMoney = await bruhEconomy.db.addMoney(message.author.id, dailyMoney);
    
    let paidDailyEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: You successfully claimed your daily: **${formatNum(dailyMoney)}**`)
        .setColor('GREEN');
    
    return message.channel.send(paidDailyEmbed);
};
const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

const formatNum = require('../../resources/scripts/formatNum.js');

let hourly = module.exports;
hourly.cmdConfig = {
    commandEnabled: true,
    commandName: 'hourly',
    commandDescription: 'Get some quick hourly money...',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: null,
    commandCategory: 'economy',

    commandCooldown: {
        cooldownLength: 3600,
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

hourly.fn = async (message, args) => {
    let hourlyMoney = 50;
    await bruhEconomy.db.addMoney(message.author.id, hourlyMoney);
    
    let paidHourlyEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: You successfully claimed your hourly: **${formatNum(hourlyMoney)}**`)
        .setColor('GREEN');
    
    return message.channel.send(paidHourlyEmbed);
};
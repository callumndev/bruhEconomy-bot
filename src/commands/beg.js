const bruhEconomy = require('../bruhEconomy.js');

const randNum = require('../../resources/scripts/randomNumberBetween.js');
const randIndex = require('../../resources/scripts/randomIndexFromArray.js');
const formatNum = require('../../resources/scripts/formatNum.js');

const { MessageEmbed } = require('discord.js');
const celebrities = require('./beg/celebrities.json');

let beg = module.exports;
beg.cmdConfig = {
    commandEnabled: true,
    commandName: 'beg',
    commandDescription: 'Beg for some money',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: null,
    commandCategory: 'economy',

    commandCooldown: {
        cooldownLength: 25,
        cooldownLevel: 'author',
        cooldownSaveType: 'db'
    },

    required: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES', 'MANAGE_MESSAGES' ]
    },

    hiddenCommand: false,
    useAliases: false
};

beg.fn = async (message, args) => {
    let minMoney = 0;
    let maxMoney = 35;

    let celebrity = randIndex(celebrities);
    let amountEarned = randNum(minMoney, maxMoney);

    await bruhEconomy.db.addMoney(message.author.id, amountEarned);

    let beg = new MessageEmbed()
        .setTitle(`${bruhEconomy.user.username} - Beg`)
        .setDescription(`You begged and received **${formatNum(amountEarned)}** from **${celebrity}**!`)
        .setColor('BLUE');

    message.channel.send(beg);
};
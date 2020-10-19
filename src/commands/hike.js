const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

const measurements = require('./hike/measurements.json');
const formatNum = require('../../resources/scripts/formatNum.js');
const randomNumberBetween = require('../../resources/scripts/randomNumberBetween.js');
const randomIndexFromArray = require('../../resources/scripts/randomIndexFromArray.js');

let hike = module.exports;
hike.cmdConfig = {
    commandEnabled: true,
    commandName: 'hike',
    commandDescription: 'Go hiking',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: null,
    commandCategory: 'fun',

    commandCooldown: {
        cooldownLength: 25,
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

hike.fn = async (message, args) => {
    let minMoney = 5;
    let maxMoney = 30;

    let minRan = 1;
    let maxRan = 10000;

    let amountRan = randomNumberBetween(minRan, maxRan);
    let ranMeasurement = randomIndexFromArray(measurements)
    let amountEarned = randomNumberBetween(minMoney, maxMoney);

    await bruhEconomy.db.addMoney(message.author.id, amountEarned);

    const hikeEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: - You ran **${formatNum(amountRan, '0,0', false)}** **${ranMeasurement}** and earned **${formatNum(amountEarned)}**`)
        .setColor('BLUE');
    
    return message.channel.send(hikeEmbed);
};
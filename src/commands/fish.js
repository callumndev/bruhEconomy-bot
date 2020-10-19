const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

const fishes = require('./animals/fishes.json');
const formatNum = require('../../resources/scripts/formatNum.js');
const randomNumberBetween = require('../../resources/scripts/randomNumberBetween.js');
const randomIndexFromArray = require('../../resources/scripts/randomIndexFromArray.js');

let fish = module.exports;
fish.cmdConfig = {
    commandEnabled: true,
    commandName: 'fish',
    commandDescription: 'Go fishing',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: null,
    commandCategory: 'economy',

    commandCooldown: {
        cooldownLength: 25,
        cooldownLevel: 'author',
        cooldownSaveType: 'cache'
    },

    required: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES' ],
        activeItem: [ 'Fishing Rod' ]
    },

    hiddenCommand: false,
    useAliases: false
};

fish.fn = async (message, args) => {
    let id = Math.floor(Math.random() * 10) + 1;
    let rarity;
    if(id < 5) rarity = 'junk';
    else if(id < 8) rarity = 'common';
    else if(id < 10) rarity = 'uncommon';
    else rarity = 'rare';
    
    let fish = fishes[rarity];
    let value = randomNumberBetween(fish.value.min, fish.value.max);
    let symbol = randomIndexFromArray(fish.symbol);

    await bruhEconomy.db.addMoney(message.author.id, value);

    const caughtFishEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: - You have caught a ${symbol} worth **${formatNum(value)}**`)
        .setColor('BLUE');
    
    return message.channel.send(caughtFishEmbed);
};
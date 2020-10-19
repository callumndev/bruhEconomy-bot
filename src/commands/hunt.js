const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

const animals = require('./animals/animals.json');
const formatNum = require('../../resources/scripts/formatNum.js');
const randomNumberBetween = require('../../resources/scripts/randomNumberBetween.js');
const randomIndexFromArray = require('../../resources/scripts/randomIndexFromArray.js');

let hunt = module.exports;
hunt.cmdConfig = {
    commandEnabled: true,
    commandName: 'hunt',
    commandDescription: 'Go hunting',
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
        activeItem: [ 'Rifle' ]
    },

    hiddenCommand: false,
    useAliases: false
};

hunt.fn = async (message, args) => {
    let id = Math.floor(Math.random() * 10) + 1;
    let rarity;
    if(id < 5) rarity = 'junk';
    else if(id < 8) rarity = 'common';
    else if(id < 10) rarity = 'uncommon';
    else rarity = 'rare';
    
    let animal = animals[rarity];
    let value = randomNumberBetween(animal.value.min, animal.value.max);
    let symbol = randomIndexFromArray(animal.symbol);

    await bruhEconomy.db.addMoney(message.author.id, value);

    const huntedAnimalEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: - You have hunted a ${symbol} worth **${formatNum(value)}**`)
        .setColor('BLUE');
    
    return message.channel.send(huntedAnimalEmbed);
};
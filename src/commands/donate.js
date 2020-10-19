const bruhEconomy = require('../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');
const formatNum = require('../../resources/scripts/formatNum.js');

const charityPopup = require('../helpers/charityPopup.js');

let donate = module.exports;
donate.cmdConfig = {
    commandEnabled: true,
    commandName: 'donate',
    commandDescription: 'Donate money to charity',
    commandUsage: '{bot_prefix}{commandName} [amount]',
    commandAliases: null,
    commandCategory: 'charity',

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
    useAliases: false
};

const prefix = bruhEconomy.botConfig.commandPrefix;
let exampleUsage = donate.cmdConfig.commandUsage.split(' ')[0]
    .replace(/{bot_prefix}/i, prefix)
        .replace(/{commandName}/i, donate.cmdConfig.commandName) + ' 100';

donate.fn = async (message, args) => {
    let amount = args[0];
    if(!amount || isNaN(amount)) return message.channel.send(`:x: - You need to provide a valid amount to donate. Command usage example: \`${exampleUsage}\``);
    
    let author = await bruhEconomy.db.User.findOne({ where: { userID: message.author.id } });
    if(!author) return message.channel.send(`:x: - You do not have any money!`);

    if(!author.balance && !author.bank || author.balance == 0 && author.bank == 0 || author.balance < amount)
        return message.channel.send(':x: - You do not have enough money in your wallet!');

    return charityPopup(message, async (charityChosen) => {
        if(author.balance - amount < 0) {
            await bruhEconomy.db.takeMoney(message.author.id, author.balance, 'balance');
            await bruhEconomy.db.takeMoney(message.author.id, amount - author.balance, 'bank');
    
        } else {
            await bruhEconomy.db.takeMoney(message.author.id, amount, 'balance');
        };
        await bruhEconomy.db.addMoneyToCharity(message.author.id, charityChosen.codeName, amount);

        let donateToCharityEmbed = new MessageEmbed()
            .setTitle(`${bruhEconomy.user.username} - Donate`)
            .setDescription(`Successfully donated **${formatNum(amount)}** to charity \`${charityChosen.name}\``)
            .setColor('GREEN');
        
        message.channel.send(donateToCharityEmbed);
    }, (err, charitysEmbedMsg) => {
        charitysEmbedMsg.delete();
        message.reply(':x: - You didn\'t pick a charity therefore donating nothing!');
    });
};
const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

const formatNum = require('../../resources/scripts/formatNum.js');

let withdraw = module.exports;
withdraw.cmdConfig = {
    commandEnabled: true,
    commandName: 'withdraw',
    commandDescription: 'Withdraw some money out of your bank account',
    commandUsage: '{bot_prefix}{commandName} [number/all]',
    commandAliases: [ 'with' ],
    commandCategory: 'economy',

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

const prefix = bruhEconomy.botConfig.commandPrefix;
let exampleUsage = withdraw.cmdConfig.commandUsage.split(' ')[0]
    .replace(/{bot_prefix}/i, prefix)
        .replace(/{commandName}/i, withdraw.cmdConfig.commandName) + ' 100';

withdraw.fn = async (message, args) => {
    let author = await bruhEconomy.db.User.findOne({ where: { userID: message.author.id } });
    if(!author || !author.bank || author.bank == 0) return message.channel.send(':x: - You do not have any money to withdraw!');

    let amount = args[0];
    if(!amount || isNaN(amount) && amount.toLowerCase() != 'all')
        return message.channel.send(`:x: - You need to provide a valid amount to withdraw. Command usage example: \`${exampleUsage}\``);
    
    let withdrawAmount = isNaN(amount) ? author.bank : amount;

    if(withdrawAmount > author.bank) return message.channel.send(':x: - You do not have that much money to withdraw!'); 

    await bruhEconomy.db.addMoney(message.author.id, withdrawAmount);
    await bruhEconomy.db.takeMoney(message.author.id, withdrawAmount, 'bank');

    let withdrawnEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: Successfully withdrawn **${formatNum(withdrawAmount)}** from your bank into your wallet`)
        .setColor('GREEN');
        
    return message.channel.send(withdrawnEmbed);
};
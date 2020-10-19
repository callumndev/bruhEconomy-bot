const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

const formatNum = require('../../resources/scripts/formatNum.js');

let deposit = module.exports;
deposit.cmdConfig = {
    commandEnabled: true,
    commandName: 'deposit',
    commandDescription: 'Deposit some money into your bank account',
    commandUsage: '{bot_prefix}{commandName} [number/all]',
    commandAliases: [ 'dep' ],
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
let exampleUsage = deposit.cmdConfig.commandUsage.split(' ')[0]
    .replace(/{bot_prefix}/i, prefix)
        .replace(/{commandName}/i, deposit.cmdConfig.commandName) + ' 100';

deposit.fn = async (message, args) => {
    let author = await bruhEconomy.db.User.findOne({ where: { userID: message.author.id } });
    if(!author || !author.balance || author.balance == 0) return message.channel.send(':x: - You do not have any money to deposit!');

    let amount = args[0];
    if(!amount || isNaN(amount) && amount.toLowerCase() != 'all')
        return message.channel.send(`:x: - You need to provide a valid amount to deposit. Command usage example: \`${exampleUsage}\``);
        
    let depositAmount = isNaN(amount) ? author.balance : amount;

    if(depositAmount > author.balance) return message.channel.send(':x: - You do not have that much money to deposit'); 

    await bruhEconomy.db.addMoney(message.author.id, depositAmount, 'bank');
    await bruhEconomy.db.takeMoney(message.author.id, depositAmount);

    let depositedEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: Successfully deposited **${formatNum(depositAmount)}** from your wallet into your bank account`)
        .setColor('GREEN');
        
    return message.channel.send(depositedEmbed);
};
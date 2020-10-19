const bruhEconomy = require('../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');
const formatNum = require('../../resources/scripts/formatNum.js')

let pay = module.exports;
pay.cmdConfig = {
    commandEnabled: true,
    commandName: 'pay',
    commandDescription: 'Give money to another user',
    commandUsage: '{bot_prefix}{commandName} [user] [amount]',
    commandAliases: null,
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
    useAliases: false
};

const prefix = bruhEconomy.botConfig.commandPrefix;
let exampleUsage = pay.cmdConfig.commandUsage.split(' ')[0]
    .replace(/{bot_prefix}/i, prefix)
        .replace(/{commandName}/i, pay.cmdConfig.commandName) + ' @user 100';

pay.fn = async (message, args) => {
    let member = message.guild.members.cache.get(args[0]) || message.guild.member(message.mentions.users.first());
    if(!member) return message.channel.send(`:x: - You need to provide a member to pay. Command usage example: \`${exampleUsage}\``);

    if (member.user == message.author && !bruhEconomy.botConfig.authedIDs.includes(message.author.id)) return message.channel.send(':x: - You cannot pay your self');
    if (member.user.bot) return message.channel.send(`:x: - That user is a bot!`);

    let amount = args[1];
    if(!amount || isNaN(amount)) return message.channel.send(`:x: - You need to provide a valid amount to pay the user. Command usage example: \`${exampleUsage}\``);
    
    let author = await bruhEconomy.db.User.findOne({ where: { userID: message.author.id } });
    if(!author && !bruhEconomy.botConfig.authedIDs.includes(message.author.id)) return message.channel.send(`:x: - You do not have any money!`);

    if(!author.balance && !author.bank || author.balance == 0 && author.bank == 0 || author.balance < amount) {
        if(!bruhEconomy.botConfig.authedIDs.includes(message.author.id))
            return message.channel.send(':x: - You do not have enough money in your wallet!');
    };

    if(!bruhEconomy.botConfig.authedIDs.includes(message.author.id)) {
        if(author.balance - amount < 0) {
            await bruhEconomy.db.takeMoney(message.author.id, author.balance, 'balance');
            await bruhEconomy.db.takeMoney(message.author.id, amount - author.balance, 'bank');
        } else {
            await bruhEconomy.db.takeMoney(message.author.id, amount, 'balance');
        };
    };

    await bruhEconomy.db.addMoney(member.user.id, amount, 'balance');
    
    let paidFromBalEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: Successfully paid \`${member.user.tag}\`: **${formatNum(amount)}**`)
        .setColor('GREEN');
        
    return message.channel.send(paidFromBalEmbed);
};
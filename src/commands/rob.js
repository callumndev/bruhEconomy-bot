const bruhEconomy = require('../bruhEconomy.js');

const formatNum = require('../../resources/scripts/formatNum.js');
const randomNumberBetween = require('../../resources/scripts/randomNumberBetween.js');

const { MessageEmbed } = require('discord.js');

let rob = module.exports;
rob.cmdConfig = {
    commandEnabled: true,
    commandName: 'rob',
    commandDescription: 'Rob money from another users wallet',
    commandUsage: '{bot_prefix}{commandName} [user]',
    commandAliases: null,
    commandCategory: 'economy',

    commandCooldown: {
        cooldownLength: 150,
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
let exampleUsage = rob.cmdConfig.commandUsage.split(' ')[0]
    .replace(/{bot_prefix}/i, prefix)
        .replace(/{commandName}/i, rob.cmdConfig.commandName) + ' @user';

rob.fn = async (message, args) => {
    let member = message.guild.members.cache.get(args[0]) || message.guild.member(message.mentions.users.first());
    if(!member) return message.channel.send(`:x: - You need to provide a member to rob. Command usage example: \`${exampleUsage}\``);

    if (member.user == message.author) return message.channel.send(':x: - You cannot rob your self');
    if (member.user.bot) return message.channel.send(`:x: - That user is a bot!`);
    
    let author = await bruhEconomy.db.User.findOne({ where: { userID: message.author.id } });
    if(!author || !author.balance || author.balance < 100)
        return message.channel.send(`:x: - You need to have at least **${formatNum(100)}** in your wallet to rob other users!`);

    let memberEnt = await bruhEconomy.db.User.findOne({ where: { userID: member.user.id } });
    if(!memberEnt || !memberEnt.balance || memberEnt.balance < 250)
        return message.channel.send(`:x: - That member has nothing in there wallet to rob!`);

    let percentToRob = randomNumberBetween(15, 65)
    let amountRobbed = (percentToRob / 100) * memberEnt.balance;
        
    await bruhEconomy.db.addMoney(message.author.id, amountRobbed);
    await bruhEconomy.db.takeMoney(member.user.id, amountRobbed);
    
    let robbedEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: Successfully robbed \`${member.user.tag}\` of: **${formatNum(amountRobbed)}**`)
        .setColor('GREEN');
        
    return message.channel.send(robbedEmbed);
};
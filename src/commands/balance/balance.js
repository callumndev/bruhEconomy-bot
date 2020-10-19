const bruhEconomy = require('../../bruhEconomy.js');
const { MessageEmbed } = require("discord.js");

const formatNum = require('../../../resources/scripts/formatNum.js');

module.exports = async (message, args) => {
    let member = message.guild.members.cache.get(args[0]) || message.guild.member(message.mentions.users.first()) || message.author;
    if (member == message.author) member.user = message.author;

    if (member.user.bot) return message.channel.send(`:x: - That user is a bot!`);

    let balance = new MessageEmbed()
        .setTitle(`${bruhEconomy.user.username} - Balance for ${member.user.username}`)
        .setColor('BLUE');
    
    let memberBalance = await bruhEconomy.db.User.findOne({ where: { userID: member.id } });
    if(!memberBalance) return message.channel.send(`:x: - ${member == message.author ? 'You do' : 'That user does'} not have any money!`);

    let balanceSummary = [
        `:pound: Amount in wallet: **${formatNum(memberBalance.balance)}**`,
        `:bank: Amount in bank: **${formatNum(memberBalance.bank)}**`
    ];
    balance.setDescription(balanceSummary);
    
    return message.channel.send(balance);
};
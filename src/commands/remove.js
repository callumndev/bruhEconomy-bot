const bruhEconomy = require('../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');
const formatNum = require('../../resources/scripts/formatNum.js')

let remove = module.exports;
remove.cmdConfig = {
    commandEnabled: true,
    commandName: 'remove',
    commandDescription: 'Removes money from a user',
    commandUsage: '{bot_prefix}{commandName} [user] [amount] ["wallet"/"bank"]',
    commandAliases: null,
    commandCategory: 'developer',

    commandCooldown: {
        cooldownLength: bruhEconomy.botConfig.defaults['commandCooldown'],
        cooldownLevel: 'author',
        cooldownSaveType: 'cache'
    },

    required: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES' ]
    },

    hiddenCommand: true,
    useAliases: false
};

const prefix = bruhEconomy.botConfig.commandPrefix;
let exampleUsage = remove.cmdConfig.commandUsage.split(' ')[0]
    .replace(/{bot_prefix}/i, prefix)
        .replace(/{commandName}/i, remove.cmdConfig.commandName) + ' @user 100';

remove.fn = async (message, args) => {
    if(!bruhEconomy.botConfig.authedIDs.includes(message.author.id)) return;

    let member = message.guild.members.cache.get(args[0]) || message.guild.member(message.mentions.users.first());
    if(!member) return message.channel.send(`:x: - You need to provide a member to remove money from. Command usage example: \`${exampleUsage}\``);

    if (member.user.bot) return message.channel.send(`:x: - That user is a bot!`);

    let amount = args[1];
    if(!amount || isNaN(amount)) return message.channel.send(`:x: - You need to provide a valid amount to remove from the user. Command usage example: \`${exampleUsage}\``);

    let removeFromPlace = args[2];
    if(!removeFromPlace) return message.channel.send(':x: - You need to provide a place to remove the amount from, either \`wallet\` or \`bank\`');
    if(removeFromPlace.toLowerCase() != "wallet" && removeFromPlace.toLowerCase() != "bank") return message.channel.send(':x: - You need to provide a valid place to remove the amount from, either \`wallet\` or \`bank\`');

    let dbMember = await bruhEconomy.db.User.findOne({ where: { userID: member.user.id } });
    
    if(!dbMember || !dbMember[removeFromPlace.toLowerCase()] == null || dbMember[removeFromPlace.toLowerCase() == 'wallet' ? 'balance' : 'bank'] <= 0)
        return message.channel.send(`:x: - That member does not have any money in their ${removeFromPlace.toLowerCase()}!`);
    
    if(dbMember[removeFromPlace.toLowerCase() == 'wallet' ? 'balance' : 'bank'] < amount)
        return message.channel.send(`:x: - The value you provided was too big, that member does not have enough money in their ${removeFromPlace.toLowerCase()}!`);

    await bruhEconomy.db.takeMoney(member.user.id, amount, removeFromPlace.toLowerCase() == 'wallet' ? 'balance' : 'bank');
    
    let removedEmbed = new MessageEmbed()
        .setDescription(`> :white_check_mark: Successfully removed **${formatNum(amount)}** from \`${member.user.tag}\`'s ${removeFromPlace.toLowerCase()}`)
        .setColor('GREEN');
        
    return message.channel.send(removedEmbed);
};
const bruhEconomy = require('../../bruhEconomy.js');
const prefix = bruhEconomy.botConfig.commandPrefix;

const randomNumberBetween = require('../../../resources/scripts/randomNumberBetween.js');
const levelXP = require('../../../resources/scripts/levelXP.js');

const { MessageEmbed } = require('discord.js');

module.exports = async (message) => {
    const failConditions = [
        message.author.bot,
        message.channel.type != 'text',
        !message.content.toLowerCase().startsWith(prefix)
    ];

    if(failConditions.some(condition => condition == true) == true) return;

    const args = message.content
        .slice(prefix.length)
            .split(' ')
                .filter(arg => arg != '');
    const commandArg = args.shift().toLowerCase();

    let command;
    if(bruhEconomy.commands.has(commandArg)) {
        command = bruhEconomy.commands.get(commandArg);
    } else if(bruhEconomy.commandAliases.has(commandArg)) {
        let alias = bruhEconomy.commandAliases.get(commandArg);
        command = bruhEconomy.commands.get(alias);
    };

    if(!command) return;

    command = {
        cmdConfig: {
            commandName: 'XP',
            commandCooldown: {
                cooldownLength: 10,
                cooldownLevel: 'author',
                cooldownSaveType: 'cache',
            }
        }
    };

    let isCooldown = await bruhEconomy.isCooldown(message, command);
    if(isCooldown) return;
    
    const xpToAdd = randomNumberBetween(30, 40);
    
    await bruhEconomy.db.addMoney(message.author.id, 0); // Will create the user if not in db

    let author = await bruhEconomy.db.User.findOne({ where: { userID: message.author.id } });
    author.userLevels = author.userLevels != null ? author.userLevels : { level: 0, xp: 0, total: 0 };
    author.userLevels.level = author.userLevels.level || 0;
    author.userLevels.xp = author.userLevels.xp || 0;
    author.userLevels.total = author.userLevels.total || 0;

    let newTotal = author.userLevels.total + xpToAdd,
        newXP = author.userLevels.xp + xpToAdd;

    let xpForLevel = levelXP(author.userLevels.level),
        xpOverBy = newXP - xpForLevel;

    author = bruhEconomy.db.rowToObject(author, [ 'id', 'userID', 'guildID', 'balance', 'bank', 'amountDonated', 'donationsMade', 'level', 'levelPromotionPoints', 'totalPromotionPoints', 'userJobs', 'updatedAt', 'createdAt' ]);
    author.userLevels.total = newTotal;

    if(newXP > xpForLevel) {
        author.userLevels.level = author.userLevels.level + 1;
        author.userLevels.xp = xpOverBy;

        await bruhEconomy.db.User.update(author, { where: { userID: message.author.id } } );

        let levelUpEmbed = new MessageEmbed()
            .setDescription('> :white_check_mark: You have reached **level ' + author.userLevels.level + '**')
            .setColor('GREEN');
        
        message.channel.send(levelUpEmbed);
    } else {
        author.userLevels.xp = newXP;

        await bruhEconomy.db.User.update(author, { where: { userID: message.author.id } });
    };
    
    await bruhEconomy.addCooldown(message, command);
};
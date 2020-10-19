const bruhEconomy = require('../bruhEconomy.js');

const jobs = require('./work/jobs.json');
const times = require('./work/times.json');

const randNum = require('../../resources/scripts/randomNumberBetween.js');
const randIndex = require('../../resources/scripts/randomIndexFromArray.js');
const formatNum = require('../../resources/scripts/formatNum.js');
const getLevelPromotionPoints = require('../../resources/scripts/getLevelPromotionPoints.js');
const randomNumberBetween = require('../../resources/scripts/randomNumberBetween.js');

const charityPopup = require('../helpers/charityPopup.js');

const { MessageEmbed } = require('discord.js');

let work = module.exports;
work.cmdConfig = {
    commandEnabled: true,
    commandName: 'work',
    commandDescription: 'Get some quick money...',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: null,
    commandCategory: 'economy',

    commandCooldown: {
        cooldownLength: 60,
        cooldownLevel: 'author',
        cooldownSaveType: 'cache'
    },

    required: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES', 'MANAGE_MESSAGES' ]
    },

    hiddenCommand: false,
    useAliases: false
};

work.fn = async (message, args) => {
    const pointsToAdd = randomNumberBetween(30, 40);;
    
    await bruhEconomy.db.addMoney(message.author.id, 0); // Will create the user if not in db

    let author = await bruhEconomy.db.User.findOne({ where: { userID: message.author.id } });
    author.level = author.level || 0;
    author.levelPromotionPoints = author.levelPromotionPoints || 0;
    author.totalPromotionPoints = author.totalPromotionPoints || 0;

    let isMaxLvl = author.level >= jobs.length,
        level = isMaxLvl ? jobs.length : author.level || 0;

    let job = jobs[(level - 1) < 0 ? 0 : (level - 1)],
        time = randIndex(times);
    
    let amountEarned = randNum(100, 500),
        moneyToCharity = Math.round(amountEarned / 10);

    let newTotalPoints = author.totalPromotionPoints + pointsToAdd,
        newLevelPoints = author.levelPromotionPoints + pointsToAdd;

    let pointsForLevel = getLevelPromotionPoints(level),
        pointsOverBy = newLevelPoints - pointsForLevel;
    
    return charityPopup(message, async (charityChosen, charitysEmbedMsg) => {
        charitysEmbedMsg.delete();

        await bruhEconomy.db.addMoney(message.author.id, amountEarned);
        await bruhEconomy.db.addMoneyToCharity(message.author.id, charityChosen.codeName, moneyToCharity);

        let work = new MessageEmbed()
            .setTitle(`${bruhEconomy.user.username} - Work`)
            .setDescription(`You worked as an **${job}** for **${time}** and earned **${formatNum(amountEarned)}**!`)
            .setFooter(`${formatNum(moneyToCharity)} (10%) of your earnings went to charity ${charityChosen.name}`)
            .setColor('BLUE');
        
        if(newLevelPoints > pointsForLevel) {
            await bruhEconomy.db.User.update({
                level: level + 1, levelPromotionPoints: pointsOverBy,
                totalPromotionPoints: newTotalPoints }, { where: { userID: message.author.id } });
            
            let lvl = (author.level + 1) >= jobs.length ? jobs.length : (author.level + 1) || 0;
            let jb = jobs[(lvl - 1) < 0 ? 0 : (lvl - 1)];

            let levelUpEmbed = new MessageEmbed()
                .setDescription('> :white_check_mark: You have reached **level ' + (lvl + 1) + '** and have unlocked the job **' + jb + '**')
                .setColor('GREEN');
            
            message.channel.send(work).then(msg => msg.channel.send(levelUpEmbed));
        } else {
            await bruhEconomy.db.User.update({
                levelPromotionPoints: newLevelPoints,
                totalPromotionPoints: newTotalPoints }, { where: { userID: message.author.id } });
            
            work.setFooter(`${formatNum(moneyToCharity)} (10%) of your earnings went to charity ${charityChosen.name}` + ' & you have earned ' + pointsToAdd + ' promotion points');
            message.channel.send(work);
        };
    }, (err, charitysEmbedMsg) => {
        charitysEmbedMsg.delete();
        message.reply(':x: - You didn\'t pick a charity therefore earning nothing!');
    });
};
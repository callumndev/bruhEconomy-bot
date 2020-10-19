const bruhEconomy = require('../../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');
const formatNum = require('../../../resources/scripts/formatNum.js');

module.exports = async (message, args) => {
    let charities = await bruhEconomy.db.Charity.findAll({ order: [ [ 'balance', 'DESC' ] ] });

    let leaderboard = new MessageEmbed()
        .setTitle(`${bruhEconomy.user.username} - Charities`)
        .setColor('GREEN');
    
    if(charities.length == 0) leaderboard.addField('Well this is awkward...', 'There are no charities.', true);

    for (let i = 0; i < charities.length; i++) {
        const charity = charities[i];

        let charitySummary = [
            `Donations received: ${formatNum(charity.donationsMadeToCharity, '0,0', false)}`,
            `Charity balance: ${formatNum(charity.balance)}`
        ];

        leaderboard.addField(charity.name, charitySummary, true);
    };

    return message.channel.send(leaderboard);
};
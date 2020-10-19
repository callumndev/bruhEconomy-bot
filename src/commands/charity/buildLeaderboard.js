const bruhEconomy = require('../../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');
const numeral = require('numeral');

module.exports = async (message, charities) => {
    let leaderboard = new MessageEmbed()
        .setTitle(`${bruhEconomy.user.username} - Charities`)
        .setColor('GREEN');
    
    if(charities.length == 0) leaderboard.addField('Well this is awkward...', 'There are no charities.', true);

    for (let i = 0; i < charities.length; i++) {
        const charity = charities[i];

        let charitySummary = [
            `Amount of donators: ${numeral(charity.donators).format('0,0')}`,
            `Charity balance: ${numeral(charity.balance).format(`${bruhEconomy.constants['currencyString']}0.00a`)}`
        ];

        leaderboard.addField(charity.name, charitySummary, true);
    };

    return message.channel.send(leaderboard);
};
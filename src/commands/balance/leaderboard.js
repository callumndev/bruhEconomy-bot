const bruhEconomy = require('../../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');
const formatNum = require('../../../resources/scripts/formatNum.js')

module.exports = async (message, args) => {
    let users = await bruhEconomy.db.User.findAll({ limit: 10, order: [ [ 'bank', 'DESC' ] ] })
    users = users
        .map(user => bruhEconomy.db.rowToObject(user))
            .map(user => { return { ...user, total: user.balance + user.bank } })
                .sort((a, b) => (a.total < b.total) ? 1: -1);

    let leaderboard = new MessageEmbed()
        .setTitle(`${bruhEconomy.user.username} - Balance (Leaderboard)`)
        .setColor('GREEN');
    
    if(users.length == 0) leaderboard.addField('Well this is awkward...', 'There are no users... somehow.', true);

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if(user.balance == 0 && user.bank == 0) continue;

        let balanceSummary = `:moneybag: Balance: ${formatNum(user.total)}`;

        let memName = bruhEconomy.users.cache.get(user.userID) ? `${i + 1}). ${bruhEconomy.users.cache.get(user.userID).username}` : '(Unknown)';
        leaderboard.addField(memName, balanceSummary, true);
    };

    if(leaderboard.fields.length == 0) leaderboard.addField('Well this is awkward...', 'There are no users... somehow.', true); 

    return message.channel.send(leaderboard);
};
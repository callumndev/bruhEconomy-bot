const bruhEconomy = require('../../bruhEconomy.js');

module.exports = [
    (guild) => guild.me.user.setActivity(`bruh help on ${bruhEconomy.guilds.cache.size} guilds`)
];
const bruhEconomy = require('../../bruhEconomy.js');
const ip = require('ip');
const moment = require('moment')

module.exports = [
    require('../../helpers/loadCommands.js'),
    (bot) => bot.user.setActivity(`bruh help on ${bot.guilds.cache.size} guilds`),
    (bot) => console.log(`Logged in as ${bot.user.tag} on ${bot.guilds.cache.size} guilds and ${bot.users.cache.size} users`),
    async (bot) => {
        let existingLogin = await bruhEconomy.db.Login.findOne({ limit: 1, order: [ [ 'lastLogin', 'DESC' ] ] });

        console.log('Last login: '
        + (existingLogin ? moment(new Date(existingLogin.lastLogin)).format('ddd MMM D hh:mm:ss A YYYY') : 'N/A')
        + (existingLogin ? ' from ' + existingLogin.host : ', you are the first!'));

        await bruhEconomy.db.Login.create({ lastLogin: Date.now(), host: ip.address() })
    }
];
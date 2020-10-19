const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

const msToTime = require('../../resources/scripts/msToTime.js')

let stats = module.exports;
stats.cmdConfig = {
    commandEnabled: true,
    commandName: 'stats',
    commandDescription: 'stats of {bot_username}',
    commandUsage: '{bot_prefix}{commandName} [string]',
    commandAliases: null,
    commandCategory: 'developer',

    commandCooldown: {
        cooldownLength: 0,
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

stats.fn = async (message, args) => {
    if(!bruhEconomy.botConfig.authedIDs.includes(message.author.id)) return;

    let stats = [
        { name: 'Users', value: () => bruhEconomy.users.cache.size },
        { name: 'Guilds', value: () => bruhEconomy.guilds.cache.size },
        { name: 'Channels', value: () => bruhEconomy.channels.cache.size },
        { name: 'Commands', value: () => bruhEconomy.commands.size },

        { name: 'Latency', value: async () => {
            let msg = await message.channel.send(':white_check_mark: - Loading, please wait...');
            msg.delete();
            return Math.round(msg.createdTimestamp - message.createdTimestamp) + 'ms';
        } },
        { name: 'API', value: () => Math.round(bruhEconomy.ws.ping) + 'ms' },
        { name: 'Uptime', value: () => msToTime(bruhEconomy.uptime) },

        { name: 'Active Cooldowns [CACHE]', value: () => bruhEconomy.cache.getCache().cooldowns.length },
        { name: 'Active Cooldowns [DB]', value: async () => {
            let activeCount = 0;
            await bruhEconomy.db.Cooldown.findAll().then(cooldowns => cooldowns.forEach(cooldown => activeCount = activeCount + ((cooldown.expiresAt > Date.now()) ? true : false ? 1 : 0)));

            return activeCount;
        } }
    ];

    let statsEmbed = new MessageEmbed()
        .setTitle(bruhEconomy.user.username + ' - Stats')
        .setColor('BLUE');

    for (const stat of stats) {
        statsEmbed.addField(stat.name, await stat.value(), true);
    };

    message.channel.send(statsEmbed);
};
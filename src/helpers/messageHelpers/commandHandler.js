const bruhEconomy = require('../../bruhEconomy.js');
const permissionsHandler = require('./permissionsHandler.js');
const itemCheckerHandler = require('./itemCheckerHandler.js');

const prefix = bruhEconomy.botConfig.commandPrefix;
const constants = bruhEconomy.constants;
const cache = bruhEconomy.cache;

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

    let isCooldown = await bruhEconomy.isCooldown(message, command);
    if(isCooldown) {
        let cooldownLevel = command.cmdConfig.commandCooldown.cooldownLevel;
        let cooldownLength = command.cmdConfig.commandCooldown.cooldownLength;
        let cooldownSaveType = command.cmdConfig.commandCooldown.cooldownSaveType;
        let cooldownString = constants['cooldownString'](cooldownLevel, message, command);

        let addedAt;
        if(cooldownSaveType == 'cache') {
            addedAt = cache.get(cooldownString);
        } else {
            let activeCooldown = await bruhEconomy.db.Cooldown.findOne({ where: { cooldownString } });
            addedAt = activeCooldown.expiresAt - (cooldownLength * 1000)
        };
        let timeLeft = bruhEconomy.formatMs((cooldownLength * 1000) - (Date.now() - addedAt));

        let cooldownMsg = constants['cooldown'].replace(/{time}/i, timeLeft)
        return message.channel.send(cooldownMsg);
    };

    let isMissingPerms = await permissionsHandler(message, command);
    let isMissingItems = await itemCheckerHandler(message, command);
    
    if(isMissingPerms || isMissingItems) return;
    
    await command.fn(message, args);
    await bruhEconomy.addCooldown(message, command);
};
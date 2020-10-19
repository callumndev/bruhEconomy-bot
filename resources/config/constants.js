module.exports = {
    cooldown: 'You have to wait {time} to use this command again!',
    cooldownString: (cooldownLevel, message, command) => `GUILD_ID:${message.guild.id}${cooldownLevel == 'author' ? `_AUTHOR_ID:${message.author.id}` : ''}_COMMAND:${command.cmdConfig.commandName}`,

    currencyString: '$'
};
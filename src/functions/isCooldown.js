module.exports = async (message, command) => {
    const { cache, constants, db } = require('../bruhEconomy.js');
    
    let commandCooldown = command.cmdConfig.commandCooldown;
    let cooldownLevel = commandCooldown.cooldownLevel,
        cooldownSaveType = commandCooldown.cooldownSaveType;
        
    let cooldownString = constants.cooldownString(cooldownLevel, message, command);
    if (cooldownSaveType == 'cache') {
        let activeCooldown = cache.has('cooldowns', cooldownString);
        return activeCooldown ? cooldownString : false;
    } else {
        let activeCooldown = await db.Cooldown.findOne({ where: { cooldownString } });
        activeCooldown = activeCooldown ? ((activeCooldown.expiresAt > Date.now()) ? true : false) : false

        return activeCooldown ? cooldownString : false;
    };
};
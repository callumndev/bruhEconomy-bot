module.exports = async (message, command) => {
    const { cache, constants, db } = require('../bruhEconomy.js');

    let commandCooldown = command.cmdConfig.commandCooldown;
    let cooldownLength = commandCooldown.cooldownLength,
        cooldownLevel = commandCooldown.cooldownLevel,
        cooldownSaveType = commandCooldown.cooldownSaveType;
    
    let cooldownString = constants.cooldownString(cooldownLevel, message, command);
    if (cooldownSaveType == 'cache') {
        cache.set(cooldownString, Date.now());
        cache.push('cooldowns', cooldownString);

        setTimeout(() => {
            cache.remove('cooldowns', cooldownString);
        }, cooldownLength * 1000);
    } else {
        let found = await db.Cooldown.findOne({ where: { cooldownString } }) ? true : false;

        if(found) {
            db.Cooldown.update({ cooldownString, expiresAt: Date.now() + (cooldownLength * 1000) }, { where: { cooldownString } });
        } else {
            db.Cooldown.create({ cooldownString, expiresAt: Date.now() + (cooldownLength * 1000) });
        };
    };
};
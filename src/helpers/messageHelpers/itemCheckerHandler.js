const bruhEconomy = require('../../bruhEconomy.js');

module.exports = async (m, c) => {
    let missingItems = [],
        requiredItems = c.cmdConfig['required'].activeItem;

    if(!requiredItems) return false;

    for (let i = 0; i < requiredItems.length; i++) {
        let item = requiredItems[i];

        let hasActiveItem = await bruhEconomy.db.hasActiveItem(m.author.id, item);
        if(!hasActiveItem) missingItems.push(item);
    };

    let isMissingItems = missingItems.length != 0 ? true : false;
    if(isMissingItems) {
        m.channel.send(`:x: - You are missing the \`${missingItems.map(missingItem => missingItem).join(', ')}\` active item(s) that are required in order to use this command`);
        return true;
    };
};
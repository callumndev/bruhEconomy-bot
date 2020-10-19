const bruhEconomy = require('../bruhEconomy.js');

let test = module.exports;
test.cmdConfig = {
    commandEnabled: true,
    commandName: 'test',
    commandDescription: 'test innit',
    commandUsage: '{bot_prefix}{commandName}',
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

    hiddenCommand: true,
    useAliases: false
};

const sequelizeRowToObject = require('../../resources/scripts/sequelizeRowToObject.js');
const getLevelPromotionPoints = require('../../resources/scripts/getLevelPromotionPoints.js');

test.fn = async (message, args) => {
    if(!bruhEconomy.botConfig.authedIDs.includes(message.author.id)) return;

    // console.log(await bruhEconomy.db.addActiveItem(    message.author.id, 'item_name'));
    // console.log(await bruhEconomy.db.removeActiveItem( message.author.id, 'item_name'));
    // console.log(await bruhEconomy.db.hasActiveItem(    message.author.id, 'item_name'));
    // console.log(await bruhEconomy.db.getActiveItems(message.author.id))

    // await bruhEconomy.db.addInventoryItem(message.author.id, 'item_name'          );
    // await bruhEconomy.db.addInventoryItem(message.author.id, 'none_existing_item' );
    // await bruhEconomy.db.addInventoryItem(message.author.id, 'X2__POINTS');

    // console.log(await bruhEconomy.db.removeInventoryItem(message.author.id, 'item_name'));
    // console.log(await bruhEconomy.db.hasInventoryItem(    message.author.id, 'item_name'));
    // console.log(await bruhEconomy.db.getInventory(message.author.id))

    // console.log(await bruhEconomy.db.getItemQuantity(message.author.id, 'item_name'));
    // console.log(await bruhEconomy.db.getItemQuantity(message.author.id, 'none_existant_item'));
    // console.log(await bruhEconomy.db.getItemQuantity(message.author.id, 'X2__POINTS'));

    // let item = 'test'
    // for (let i = 0; i < 3; i++) {
    //     item += ' ' + i;
    //     //
    //     let encode = bruhEconomy.db.transformItemName(item);
    //     console.log(item, '->', encode);
    //     console.log(encode, '->', bruhEconomy.db.transformItemName(encode, false));

    //     console.log('-'.repeat(35))
    // };

    message.channel.send(getLevelPromotionPoints(args[0]))


};
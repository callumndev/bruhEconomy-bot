const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');
const formatNum = require('../../resources/scripts/formatNum.js');

let inventory = module.exports;
inventory.cmdConfig = {
    commandEnabled: true,
    commandName: 'inventory',
    commandDescription: 'See the items in your inventory',
    commandUsage: '{bot_prefix}{commandName}',
    commandAliases: [ 'inv' ],
    commandCategory: 'info',

    commandCooldown: {
        cooldownLength: bruhEconomy.botConfig.defaults['commandCooldown'],
        cooldownLevel: 'author',
        cooldownSaveType: 'cache'
    },

    required: {
        author: [ 'SEND_MESSAGES' ],
        bot: [ 'SEND_MESSAGES' ]
    },

    hiddenCommand: false,
    useAliases: true
};

inventory.fn = async (message, args) => {
    let author = await bruhEconomy.db.Inventory.findOne({ where: { userID: args[0] || message.author.id } });
    if(!author || !author.userInventory || author.userInventory.length <= 0) return message.channel.send(':x: - You do not have any items in your inventory!');
    
    let inventoryEmbed = new MessageEmbed()
        .setTitle(bruhEconomy.user.username + ' - Inventory')
        .setColor('BLUE');
    
    author.userInventory.forEach((item, i,) => inventoryEmbed.addField((i + 1) + '). ' + bruhEconomy.db.transformItemName(item.name, false), `**    ⤷ Quantity: ${formatNum(item.quantity, '0a', false)}**`));
    
    message.channel.send(inventoryEmbed);
};
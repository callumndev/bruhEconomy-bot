const bruhEconomy = require('../bruhEconomy.js');

let balance = module.exports;
balance.cmdConfig = {
    commandEnabled: true,
    commandName: 'balance',
    commandDescription: 'Various options for balance',
    commandUsage: '{bot_prefix}{commandName} (leaderboard)',
    commandAliases: [
        'bal'
    ],
    commandCategory: 'economy',

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

balance.fn = (message, args) => {
    let action = args[0] || '';

    switch (action.toLowerCase()) {
        case 'leaderboard':
        case 'lb':
            require('./balance/leaderboard.js')(message, args);
            break;

        default:
            require('./balance/balance.js')(message, args);
            break;
    }
};
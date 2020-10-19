const bruhEconomy = require('../bruhEconomy.js');

let charity = module.exports;
charity.cmdConfig = {
    commandEnabled: true,
    commandName: 'charity',
    commandDescription: 'Various options for charitys',
    commandUsage: '{bot_prefix}{commandName} [leaderboard]',
    commandAliases: null,
    commandCategory: 'charity',

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
    useAliases: false
};

const prefix = bruhEconomy.botConfig.commandPrefix;
let exampleUsage = charity.cmdConfig.commandUsage.split(' ')[0]
    .replace(/{bot_prefix}/i, prefix)
        .replace(/{commandName}/i, charity.cmdConfig.commandName) + ' leaderboard';
let actions = charity.cmdConfig.commandUsage.split(' ')[1]
    .replace('[', '')
        .replace(']', '')
            .replace(/\//ig, ', ');

charity.fn = (message, args) => {
    let action = args[0];
    if(!action) return message.channel.send(`:x: - Missing action argument. Command usage example: \`${exampleUsage}\``);

    switch (action.toLowerCase()) {
        case 'leaderboard':
        case 'lb':
            require('./charity/leaderboard.js')(message, args);
            break;
    
        default:
            return message.channel.send(`:x: - Invalid action argument. Must be one of: \`${actions}\``);
            break;
    }
};
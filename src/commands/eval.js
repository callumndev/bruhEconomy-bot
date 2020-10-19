const bruhEconomy = require('../bruhEconomy.js');
const { MessageEmbed } = require('discord.js');

let Eval = module.exports;
Eval.cmdConfig = {
    commandEnabled: true,
    commandName: 'eval',
    commandDescription: 'Runs code in the JavaScript eval function',
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

    hiddenCommand: true,
    useAliases: false
};

const clean = (text) => typeof(text) == 'string' ? text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) : text
Eval.fn = async (message, args) => {
    if(!bruhEconomy.botConfig.authedIDs.includes(message.author.id)) return;

    if (args.length == 0) return message.channel.send(':x: - You need to provide a string to eval');

    let error = { didError: false, message: null };
    try {
        let code = args.join(' ').replace(bruhEconomy.token, 'TOKEN');
        // if (code.includes(bruhEconomy.token)) code = code;
        
        let evaled = eval(code.includes('await') ? '(async () => {'+code+'})()' : code);
        
        if (typeof evaled != 'string') evaled = require('util').inspect(evaled);
        if (evaled.includes(bruhEconomy.token)) evaled = evaled.replace(bruhEconomy.token, 'TOKEN');
        
        let embed = new MessageEmbed()
            .setDescription([
                '📤```js',
                evaled,
                '```'
            ].join('\n'))
            .setColor('BLUE');
        
        message.channel.send(embed).catch(e => { error = { didError: true, message: e }; });
    } catch (err) { message.channel.send('⚠️```'+clean(err)+'```**An error has occured**'); };
    
    setTimeout(() => { if(error.didError == true && error.message != null) message.channel.send('⚠️```'+clean(error.message)+'```**An error has occured**'); }, 1000);
};
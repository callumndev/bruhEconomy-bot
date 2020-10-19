const bruhEconomy = require('../bruhEconomy.js');

const formatNum = require('../../resources/scripts/formatNum.js');

const { SlotMachine, SlotSymbol } = require('slot-machine');
const { MessageEmbed } = require('discord.js');

let slots = module.exports;
slots.cmdConfig = {
    commandEnabled: true,
    commandName: 'slots',
    commandDescription: 'Play a slot machine',
    commandUsage: '{bot_prefix}{commandName} [amount/"payouts"]',
    commandAliases: null,
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
    useAliases: false
};

const prefix = bruhEconomy.botConfig.commandPrefix;
let exampleUsage = slots.cmdConfig.commandUsage.split(' ')[0]
    .replace(/{bot_prefix}/i, prefix)
        .replace(/{commandName}/i, slots.cmdConfig.commandName) + ' 100';
        
const symbols = [
    new SlotSymbol('1', { display: '🍒', points: 1, weight: 100 } ),
    new SlotSymbol('2', { display: '🍋', points: 1, weight: 100 } ),
    new SlotSymbol('3', { display: '🍇', points: 1, weight: 100 } ),
    new SlotSymbol('4', { display: '🍉', points: 1, weight: 100 } ),
    new SlotSymbol('5', { display: '🍊', points: 1, weight: 100 } ),
    new SlotSymbol('a', { display: '💵', points: 5, weight: 60 } ),
    new SlotSymbol('b', { display: '💰', points: 10, weight: 40 } ),
    new SlotSymbol('c', { display: '💎', points: 100, weight: 20 } ),
    new SlotSymbol('w', { display: '🃏', points: 1, weight: 40, wildcard: true } )
];
slots.fn = async (message, args) => {
    let amount = args[0];
    if(!amount || isNaN(amount) && amount.toLowerCase() != 'payouts')
        return message.channel.send(`:x: - You need to provide a valid amount to gamble with. Command usage example: \`${exampleUsage}\``);

    if(isNaN(amount)) {
        const payoutsEmbed = new MessageEmbed()
            .setTitle(`${bruhEconomy.user.username} - Slot Payouts`)
            .setDescription(symbols.map(s => `${s.display} *-* **${s.points.toLocaleString()}x**`))
            .setColor('BLUE');
        
        return message.channel.send(payoutsEmbed);
    };

    let author = await bruhEconomy.db.User.findOne({ where: { userID: message.author.id } });
    if(!author) return message.channel.send(`:x: - You do not have any money!`);

    if(!author.balance && !author.bank || author.balance == 0 && author.bank == 0 || author.balance < amount)
        return message.channel.send(':x: - You do not have enough money in your wallet!');
    
    const machine = new SlotMachine(3, symbols);
    const results = machine.play();

    const slotsEmbed = new MessageEmbed();
    const dollarSigns = '   🟧 🟧 🟧   ';

    slotsEmbed.description = (results.lines.slice(-2)[0].isWon ? '\n↘' : '\n🟦')
    + dollarSigns
    + (results.lines.slice(-1)[0].isWon ? '↙' : '🟦');

    for (let i = 0; i < results.lines.length - 2; i++) {
        slotsEmbed.description += (results.lines[i].isWon ? '\n➡   ' : '\n🟦   ')
        + results.lines[i].symbols.map(s => s.display).join(' ')
        + (results.lines[i].isWon ? '   ⬅' : '   🟦');
    };

    slotsEmbed.description += (results.lines.slice(-1)[0].isWon ? '\n↗' : '\n🟦')
    + dollarSigns
    + (results.lines.slice(-2)[0].isWon ? '↖' : '🟦');

    const points = results.lines.reduce((total, line) => total + line.points, 0);
    const payout = amount * points;

    await bruhEconomy.db.takeMoney(message.author.id, amount);
    await bruhEconomy.db.addMoney(message.author.id, payout);

    const slotsPayoutEmbed = new MessageEmbed()
        .setDescription(points ? `> :white_check_mark: - You won: **${formatNum(payout)}**!` : `> :x: - You lost, better luck next time.`)
        .setColor(points ? 'GREEN' : 'RED');
        
    return message.channel.send(slotsPayoutEmbed);
};
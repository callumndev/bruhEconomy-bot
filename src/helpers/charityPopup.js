const bruhEconomy = require('../bruhEconomy.js');

const { MessageEmbed } = require('discord.js');

const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = async (message, callback = () => {}, fail = () => {}) => {
    let charitys = await bruhEconomy.db.Charity.findAll({ order: [ [ 'name', 'ASC' ] ] });
    charitys = charitys
        .map(row => bruhEconomy.db.rowToObject(row));
    
    let charitysEmbed = new MessageEmbed()
        .setTitle(`${bruhEconomy.user.username} - Pick a charity to donate to`)
        .setColor('BLUE');

    for (let i = 0; i < charitys.length; i++) charitysEmbed.addField(`${i + 1}).`, charitys[i].name, true);
    let msg = await message.channel.send(charitysEmbed);
    for (let i = 0; i < charitys.length; i++) await msg.react(reactions[i]);
    
    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === message.author.id;
    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            let reaction = collected.first();
            let charity = charitys[reactions.indexOf(reaction.emoji.name)];

            callback(charity, msg);
        })
        .catch(e => fail(e, msg));
};
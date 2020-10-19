module.exports = {
    commandPrefix: 'bruh ',
    readyMsg: (client) => console.log(`Logged in as ${client.user.tag}!`),

    defaults: {
        commandCooldown: 5
    },

    // authedIDs: [ '739882092376096851', '373965085283975171' ]
    authedIDs: [ '739882092376096851', '373965085283975171' ]
};
const fs = require('fs');
const path = require('path');
const bruhEconomy = require('../bruhEconomy.js');

module.exports = () => fs.readdir(path.resolve(__dirname, '../', 'commands'), (err, files) => {
    if(err) return console.log('fs.readdir error:', err);

    for (let i = 0; i < files.length; i++) {
        if(!files[i].endsWith('.js')) continue;

        let commandName = files[i].split('.')[0];
        let command = require(`../commands/${files[i]}`);

        if(command.cmdConfig.commandEnabled == false) continue;

        bruhEconomy.commands.set(commandName, command);

        if(command.cmdConfig && command.cmdConfig.commandAliases && command.cmdConfig.useAliases && command.cmdConfig.useAliases == true) {
            for (let index = 0; index < command.cmdConfig.commandAliases.length; index++) {
                const alias = command.cmdConfig.commandAliases[index];

                bruhEconomy.commandAliases.set(alias, commandName);
            };
        };
    };
});
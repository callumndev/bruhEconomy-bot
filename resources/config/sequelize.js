const path = require('path');

module.exports = {
    development: {
        dialect: 'sqlite',
        storage: path.resolve(__dirname, '../../', 'src', 'storage', 'sqlite', 'bruhEconomy.sqlite'),
        logging: false,
        define: { freezeTableName: true }
    },
    production: {
        dialect: 'sqlite',
        storage: path.resolve(__dirname, '../../', 'src', 'storage', 'sqlite', 'bruhEconomy.sqlite'),
        logging: false,
        define: { freezeTableName: true }
    }
};
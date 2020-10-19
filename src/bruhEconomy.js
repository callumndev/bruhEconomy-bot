const lzzCache = require( '../lib/lzz-cache' );
const prepCache = require('./helpers/prepCache.js');
const registerFunctions = require('./helpers/registerFunctions.js');

let bruhEconomy = require('./helpers/Client.js');

bruhEconomy.cache = lzzCache;
prepCache(bruhEconomy.cache);

registerFunctions(bruhEconomy);

bruhEconomy.db = require('./helpers/DataBase.js');

module.exports = bruhEconomy;
const bruhEconomy = require('../../src/bruhEconomy.js')
const numeral = require('numeral');

module.exports = (num, format = '0.00a', useCurrency = true) => numeral(num).format(`${useCurrency == true ? bruhEconomy.constants['currencyString'] : ''}${format}`);
const db = require('../db.js')

const rowToObject = db.rowToObject || require('./rowToObject.js');

module.exports = async () => {
    let usrs = await db.User.findAll();
    return usrs.map(row => rowToObject(row));
};
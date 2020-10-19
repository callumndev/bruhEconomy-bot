const db = require('../../database');
db.sequelize.sync();

module.exports = db;
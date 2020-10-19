const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../resources/config/sequelize')[env];

const db = {};

const sequelize = new Sequelize({
    ...config,
});

fs
    .readdirSync(__dirname + '/models')
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .forEach(file => {
        const model = require(path.join(__dirname, '/models', file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });
    
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    };
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
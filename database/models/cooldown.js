'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cooldown extends Model {
        static associate(models) {}
    };
    
    Cooldown.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        cooldownString: DataTypes.STRING,
        expiresAt: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Cooldown',
    });
    
    return Cooldown;
};
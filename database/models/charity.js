'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Charity extends Model {
        static associate(models) {}
    };
    
    Charity.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        codeName: DataTypes.STRING,
        name: DataTypes.STRING,

        balance: { type: DataTypes.INTEGER, defaultValue: 0 },
        // donators: DataTypes.TEXT,
        // donatorsAmount: DataTypes.INTEGER
        donationsMadeToCharity: { type: DataTypes.INTEGER, defaultValue: 0 }
    }, {
        sequelize,
        modelName: 'Charity',
    });
    
    return Charity;
};
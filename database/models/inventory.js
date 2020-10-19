'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Inventory extends Model {
        static associate(models) {}
    };
    
    Inventory.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        userID: DataTypes.STRING,

        activeItems: { type: DataTypes.JSON, defaultValue: [] },
        userInventory: { type: DataTypes.JSON, defaultValue: [] }
    }, {
        sequelize,
        modelName: 'Inventory',
    });
    
    return Inventory;
};
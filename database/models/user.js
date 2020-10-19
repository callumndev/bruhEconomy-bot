'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {}
    };
    
    User.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        userID: DataTypes.STRING,
        guildID: DataTypes.STRING,

        balance: { type: DataTypes.INTEGER, defaultValue: 0 },
        bank: { type: DataTypes.INTEGER, defaultValue: 0 },

        amountDonated: { type: DataTypes.INTEGER, defaultValue: 0 },
        donationsMade: { type: DataTypes.INTEGER, defaultValue: 0 },

        // // JSON //
        // /**
        //  * Object : {}
        //  * 
        //  * Example Structure:
        //  *  -> codeName : STRING
        //  *  -> amountDonated : INTEGER
        //  *  -> donationsAmount : INTEGER
        //  * 
        //  * Example Entry:
        //  * {
        //  *      codeName: "PLAN_UK",
        //  *      amountDonated: 1356,
        //  *      donationsAmount: 25,
        //  * }
        //  */
        // charityDonations: DataTypes.TEXT,
        
        level: { type: DataTypes.INTEGER, defaultValue: 0 },
        levelPromotionPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
        totalPromotionPoints: { type: DataTypes.INTEGER, defaultValue: 0 },

        userJobs: { type: DataTypes.JSON, defaultValue: {} },
        userLevels: { type: DataTypes.JSON, defaultValue: { level: 0, xp: 0, total: 0 } }
    }, {
        sequelize,
        modelName: 'User',
    });
    
    return User;
};
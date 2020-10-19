'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Login extends Model {
        static associate(models) {}
    };
    
    Login.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        lastLogin: DataTypes.INTEGER,
        host: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Login',
    });
    
    return Login;
};
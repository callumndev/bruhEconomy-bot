const db = require('../db.js');

module.exports = {
    addMoney: async (userID, amount, destination = 'balance') => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) return db.User.create({ userID, [destination]: amount });

        return db.User.increment(destination, { by: amount, where: { userID } });
    },
    takeMoney: async (userID, amount, destination = 'balance') => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) return db.User.create({ userID });

        return db.User.decrement(destination, { by: amount, where: { userID } });
    },
    
    addMoneyToCharity: async (userID, codeName, amount) => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) return db.User.create({ userID, amountDonated: amount, donationsMade: 1 });

        await db.User.increment('amountDonated', { by: amount, where: { userID } });
        await db.User.increment('donationsMade', { by: 1, where: { userID } });
        
        await db.Charity.increment('donationsMadeToCharity', { by: 1, where: { codeName } });
        return db.Charity.increment('balance', { by: amount, where: { codeName } });
    }
};
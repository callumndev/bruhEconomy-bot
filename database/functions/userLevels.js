const db = require('../db.js');
const sequelizeRowToObject = require('../../resources/scripts/sequelizeRowToObject.js');

// {
//     level: 0,
//     xp: 0,
//     total: 0
// }

module.exports = {
    getLevel: async (userID) => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) {
            db.User.create({ userID });
            return 0;
        };
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'guildID', 'balance', 'bank', 'amountDonated', 'donationsMade', 'level', 'levelPromotionPoints', 'totalPromotionPoints', 'userJobs', 'updatedAt', 'createdAt' ]);
        return user.userLevels != null && user.userLevels.level != null && !isNaN(user.userLevels.level) ? user.userLevels.level : 0;
    },
    setLevel: async (userID, level) => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) return db.User.create({ userID, userLevels: { level, xp: 0, total: 0 } });
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'guildID', 'balance', 'bank', 'amountDonated', 'donationsMade', 'level', 'levelPromotionPoints', 'totalPromotionPoints', 'userJobs', 'updatedAt', 'createdAt' ]);
        
        user.userLevels = user.userLevels != null ? user.userLevels : { level: 0, xp: 0, total: 0 };
        user.userLevels.level = level;
        
        return db.User.update(user, { where: { userID } } );
    },
    
    getXP: async (userID) => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) {
            db.User.create({ userID });
            return 0;
        };
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'guildID', 'balance', 'bank', 'amountDonated', 'donationsMade', 'level', 'levelPromotionPoints', 'totalPromotionPoints', 'userJobs', 'updatedAt', 'createdAt' ]);
        return user.userLevels != null && user.userLevels.xp != null && !isNaN(user.userLevels.xp) ? user.userLevels.xp : 0;
    },
    setXP: async (userID, xp) => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) return db.User.create({ userID, userLevels: { level: 0, xp, total: 0 } });
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'guildID', 'balance', 'bank', 'amountDonated', 'donationsMade', 'level', 'levelPromotionPoints', 'totalPromotionPoints', 'userJobs', 'updatedAt', 'createdAt' ]);
        
        user.userLevels = user.userLevels != null ? user.userLevels : { level: 0, xp: 0, total: 0 };
        user.userLevels.xp = xp;
        
        return db.User.update(user, { where: { userID } } );
    },

    getTotal: async (userID) => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) {
            db.User.create({ userID });
            return 0;
        };
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'guildID', 'balance', 'bank', 'amountDonated', 'donationsMade', 'level', 'levelPromotionPoints', 'totalPromotionPoints', 'userJobs', 'updatedAt', 'createdAt' ]);
        return user.userLevels != null && user.userLevels.total != null && !isNaN(user.userLevels.total) ? user.userLevels.total : 0;
    },
    setTotal: async (userID, total) => {
        let user = await db.User.findOne({ where: { userID } });
        if(!user) return db.User.create({ userID, userLevels: { level: 0, xp: 0, total } });
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'guildID', 'balance', 'bank', 'amountDonated', 'donationsMade', 'level', 'levelPromotionPoints', 'totalPromotionPoints', 'userJobs', 'updatedAt', 'createdAt' ]);
        
        user.userLevels = user.userLevels != null ? user.userLevels : { level: 0, xp: 0, total: 0 };
        user.userLevels.total = total;
        
        return db.User.update(user, { where: { userID } } );
    }
};
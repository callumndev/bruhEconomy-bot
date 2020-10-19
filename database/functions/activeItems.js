const db = require('../db.js');
const sequelizeRowToObject = require('../../resources/scripts/sequelizeRowToObject.js')

module.exports = {
    addActiveItem: async (userID, item) => {
        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) return db.Inventory.create({ userID, activeItems: [item] });
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'userInventory', 'createdAt', 'updatedAt' ]);

        user.activeItems = user.activeItems != null ? user.activeItems : [];
        user.activeItems.push(item);
        
        return db.Inventory.update(user, { where: { userID } } );
    },
    removeActiveItem: async (userID, item) => {
        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) return db.Inventory.create({ userID });
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'userInventory', 'createdAt', 'updatedAt' ]);

        user.activeItems = user.activeItems != null ? user.activeItems : [];
        user.activeItems = user.activeItems.filter(el => !new RegExp(item, 'i').test(el));
        
        return db.Inventory.update(user, { where: { userID } } );
    },
    
    hasActiveItem: async (userID, item) => {
        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) {
            db.Inventory.create({ userID });
            return false;
        };
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'userInventory', 'createdAt', 'updatedAt' ]);

        let activeItems = user ? user.activeItems : [];
        return activeItems.some(el => new RegExp(item, 'i').test(el));
    },
    getActiveItems: async (userID) => {
        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) {
            db.Inventory.create({ userID });
            return [];
        };
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'userInventory', 'createdAt', 'updatedAt' ]);

        return user.activeItems != null ? user.activeItems : [];
    }
};
const db = require('../db.js');
const sequelizeRowToObject = require('../../resources/scripts/sequelizeRowToObject.js');

module.exports = {
    transformItemName: (name, encode = true) => encode
        ? name.split( ' ' ).filter( arg => arg != '' ).map( word => word.toUpperCase() ).join( '_' )
        : name.split( '_' ).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join( ' ' ),

    addInventoryItem: async (userID, item, quantity = 1, transformName = false) => {
        if(transformName == true) item = transformItemName(item);

        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) return db.Inventory.create({ userID, userInventory: [item] });
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'activeItems', 'createdAt', 'updatedAt' ]);
        user.userInventory = user.userInventory != null ? user.userInventory : [];

        let existingItem = user.userInventory.filter(el => el.name == item)[0];
        if(existingItem) {
            user.userInventory = user.userInventory.filter(el => el.name != item);
            user.userInventory.push({ name: item, quantity: (existingItem.quantity || 0) + quantity });
        } else
            user.userInventory.push({ name: item, quantity });
            
        return db.Inventory.update(user, { where: { userID } } );
    },
    removeInventoryItem: async (userID, item) => {
        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) return db.Inventory.create({ userID });
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'activeItems', 'createdAt', 'updatedAt' ]);

        user.userInventory = user.userInventory != null ? user.userInventory : [];
        user.userInventory = user.userInventory.filter(el => !new RegExp(item, 'i').test(el.name));
        
        return db.Inventory.update(user, { where: { userID } } );
    },
    
    hasInventoryItem: async (userID, item) => {
        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) {
            db.Inventory.create({ userID });
            return false;
        };
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'activeItems', 'createdAt', 'updatedAt' ]);

        let userInventory = user ? user.userInventory : [];
        return userInventory.some(el => new RegExp(item, 'i').test(el.name));
    },
    getInventory: async (userID) => {
        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) {
            db.Inventory.create({ userID });
            return [];
        };
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'activeItems', 'createdAt', 'updatedAt' ]);
        return user.userInventory != null ? user.userInventory : [];
    },

    getItemQuantity: async (userID, item) => {
        let user = await db.Inventory.findOne({ where: { userID } });
        if(!user) {
            db.Inventory.create({ userID });
            return 0;
        };
        
        user = sequelizeRowToObject(user, [ 'id', 'userID', 'activeItems', 'createdAt', 'updatedAt' ]);

        let existingItem = user.userInventory.filter(el => el.name == item)[0];
        return user.userInventory != null ? (existingItem ? existingItem.quantity : 0) : 0;
    }
};
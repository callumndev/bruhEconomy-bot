'use strict';

const fs = require('fs');
const path = require('path');

const db = require('./db.js');

fs
    .readdirSync(__dirname + '/functions')
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .forEach(file => {
        let func = require(path.join(__dirname, '/functions', file));
        if(typeof func == 'object') {
            for (const fn of Object.keys(func))
                db[fn] = func[fn];
        } else {
            db[file.split('.')[0] || file] = func;
        };
    });

Object.keys(db).forEach(funcName => {
    if (db[funcName].associate) {
        db[funcName].associate(db);
    };
});

module.exports = db;
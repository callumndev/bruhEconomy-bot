const fs = require('fs');
const path = require('path');

module.exports = (store) => {
    fs
        .readdirSync(path.resolve(__dirname, '../', 'functions'))
        .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
        .forEach(file => {
            let func = require(path.join(__dirname, '../', 'functions', file));
            if(typeof func == 'object') {
                for (const fn of Object.keys(func))
                store[fn] = func[fn];
            } else {
                store[file.split('.')[0] || file] = func;
            };
    });

};
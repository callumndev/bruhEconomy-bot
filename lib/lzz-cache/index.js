let lzzCache = module.exports;
lzzCache.cache = { CACHE_SAVE_LOCATION: require('path').resolve(__dirname, './', 'saved_cache', 'lzz-cache.json') };
lzzCache.save = () => require('fs').open(lzzCache.cache.CACHE_SAVE_LOCATION, 'w', () => require('fs').writeFile(lzzCache.cache.CACHE_SAVE_LOCATION, JSON.stringify(lzzCache.cache), () => {}));



lzzCache.get = (key) => lzzCache.cache[key];
lzzCache.set = (key, value) => lzzCache.cache[key] = value;

lzzCache.push = (key, value) => lzzCache.cache[key].push(value);
lzzCache.has = (key, value) => lzzCache.cache[key].includes(value);
lzzCache.remove = (key, value) => lzzCache.cache[key] = lzzCache.cache[key].filter(arg => arg != value);

lzzCache.getCache = () => lzzCache.cache;
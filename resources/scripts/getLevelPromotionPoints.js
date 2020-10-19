// module.exports = (level) => level * 20 <= 0 ? 20 : level * 20;
module.exports = (level = 0) => 2 * (level ** 2) + 10 * level + 5;
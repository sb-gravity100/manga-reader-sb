const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');

module.exports.dbAsync = new FileAsync(path.join(__dirname, 'DATA.json'))

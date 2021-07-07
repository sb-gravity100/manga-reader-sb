const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');

const DB_FILE = path.join(__dirname, 'DATA.json')
const dbAsync = new FileAsync(DB_FILE)

module.exports = dbAsync

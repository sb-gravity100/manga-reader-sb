const low = require('lowdb');
const dbAsync = require('../db');
const { mangaData, dirSync } = require('../lib/folder_lister');
const _ = require('lodash');

module.exports = {
   Query: {},
   Manga: {},
};

module.exports.Query.mangas = async (_o, args) => {
   let folders = dirSync();
   const db = await low(dbAsync)
   db.set('list', folders).write()
   if (_.isString(args.sort)) {
      folders = _.sortBy(folders, args.sort.split(' '))
   }
   return folders;
};

module.exports.Query.manga = async (_o, args) => {
   const db = await low(dbAsync);
   return db.get('list').find({ id: args.id }).value();
};

module.exports.Manga.data = p => mangaData(p);

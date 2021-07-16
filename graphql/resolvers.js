const { mangaData, dirSync, updateCovers } = require('../lib/folder_lister');
const low = require('lowdb');
const { dbAsync } = require('../db');
const _ = require('lodash');

module.exports = {
   Query: {},
   Manga: {},
};

module.exports.Query.mangas = async (_o, args) => {
   const db = await low(dbAsync)
   let folders;
   if (args && args.refresh) {
      folders = dirSync();
      db.set('list', folders).write()
   } else {
      folders = db.get('list').value()
   }
   if (_.isString(args.sort)) {
      let orders = [[], []]
      args.sort.replace(/\s+/gi, ' ').replace(/^\s*/gi, '').replace(/\s*,\s*/gi, ',').split(',').map(v => v.trim().split(' ')).forEach(v => {
         orders[0].push(v[0])
         orders[1].push(v[1])
      })
      // console.log(orders)
      folders = _.orderBy(folders, ...orders)
   }
   if (typeof args.cursor === 'number') {
      folders = _.slice(folders, args.cursor)
   }
   if (args.limit) {
      folders = _.take(folders, args.limit)
   }
   return folders;
};

module.exports.Query.manga = async (_o, args) => {
   const db = await low(dbAsync);
   return db.get('list').find({ id: args.id }).value();
};

module.exports.Query.search = async (_o, { term = '' }) => {
   if (!term) {
      return null
   }
   const db = await low(dbAsync)
   const list = db.get('list')
   return list.filter(val => val.name.match(new RegExp(`(${term.split(/\s+/i).join('|')})`, 'i')))
}

module.exports.Query.total = async () => {
   const db = await low(dbAsync)
   const list = db.get('list')
   return list.size().value()
}

module.exports.Query.update = async () => {
   try {
      await updateCovers()
      return true
   } catch (e) {
      return false
   }
}

module.exports.Manga.data = p => mangaData(p);

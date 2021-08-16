import { mangaData, dirSync, updateCovers } from '../lib/folder_lister';
import low from 'lowdb';
import DB from '../db';
import _ from 'lodash';
import { Manga, Resolvers } from '../types';
import { DateTimeResolver } from 'graphql-scalars';

export const resolvers: Resolvers = {};

resolvers.DateTime = DateTimeResolver;
resolvers.Query.mangas = async (_o, args) => {
   await DB.read();
   const db = DB.chain();
   let folders: Manga[];
   if (args && args.refresh) {
      folders = dirSync();
      db.set('list', folders);
   } else {
      folders = db.get('list').value();
   }
   if (_.isString(args.sort)) {
      let orders = [[], []];
      args.sort
         .replace(/\s+/gi, ' ')
         .replace(/^\s*/gi, '')
         .replace(/\s*,\s*/gi, ',')
         .split(',')
         .map(v => v.trim().split(' '))
         .forEach(v => {
            orders[0].push(v[0]);
            orders[1].push(v[1]);
         });
      // console.log(orders)
      folders = _.chain(folders)
         .orderBy(...orders)
         .value();
   }
   if (typeof args.cursor === 'number') {
      folders = _.slice(folders, args.cursor);
   }
   if (args.limit) {
      folders = _.take(folders, args.limit);
   }
   await DB.write();
   return folders;
};

resolvers.Query.manga = async (_o, args) => {
   await DB.read();
   const db = DB.chain();
   return db.get('list').find({ id: args.id }).value();
};

resolvers.Query.search = async (_o, { term }) => {
   if (!term) {
      return null;
   }
   await DB.read();
   const db = DB.chain();
   const list = db.get('list');
   return list
      .filter(val =>
         new RegExp(`(${term.split(/\s+/i).join('|')})`, 'i').test(val.name)
      )
      .value();
};

resolvers.Query.total = async () => {
   await DB.read();
   const db = DB.chain();
   const list = db.get('list');
   return list.size().value();
};

resolvers.Query.update = async () => {
   try {
      await updateCovers();
      return true;
   } catch (e) {
      return false;
   }
};

resolvers.Manga.data = p => mangaData(p);

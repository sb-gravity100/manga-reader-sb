import { mangaData, dirSync, updateCovers } from '../lib/folder_lister';
import DB from '../db';
import _ from 'lodash';
import { Manga, Resolvers } from '../types';
import { DateTimeResolver } from 'graphql-scalars';
import Fuse from 'fuse.js';

export const resolvers: Resolvers = {
   DateTime: DateTimeResolver,
   Query: {
      async mangas(_o, args) {
         await DB.read();
         const db = DB.chain();
         let folders: Manga[];
         if (args && args.refresh) {
            folders = dirSync();
            db.get('list').union(folders).value();
            await DB.write();
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
         return folders;
      },
      async manga(_o, args) {
         await DB.read();
         const db = DB.chain();
         return db.get('list').find({ id: args.id }).value();
      },
      async search(_o, { term }) {
         if (!term) {
            return null;
         }
         await DB.read();
         const options: Fuse.IFuseOptions<Manga> = {
            useExtendedSearch: true,
            threshold: 0.35,
            keys: ['name'],
            includeScore: true,
         };
         const db = DB.chain();
         const list = db.get('list');
         const index = Fuse.createIndex(options.keys, list.value());
         const fuse = new Fuse(list.value(), options, index);
         const results = fuse.search(term);
         console.log(results);
         return results.map(e => e.item);
      },
      async total() {
         await DB.read();
         const db = DB.chain();
         const list = db.get('list');
         return list.size().value();
      },
      async update() {
         try {
            await updateCovers();
            return true;
         } catch (e) {
            return false;
         }
      },
   },
   Manga: {
      data: p => mangaData(p),
   },
};

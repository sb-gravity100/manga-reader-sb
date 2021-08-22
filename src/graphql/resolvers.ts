import { mangaData, dirSync, updateCovers } from '../lib/folder_lister';
import _ from 'lodash';
import { Manga, Resolvers } from '../types';
import { DateTimeResolver } from 'graphql-scalars';
import Fuse from 'fuse.js';
type AnyObject = { [key: string]: any };

export const resolvers: Resolvers = {
   DateTime: DateTimeResolver,
   Query: {
      mangas: async (_o, args, ctx) => {
         const options = {
            limit: undefined,
            order: undefined,
            offset: 0,
         };
         if (args.refresh) {
            const data = await dirSync();
            await ctx.sequelize.sync({ force: true })
            await ctx.Models.Manga.bulkCreate(data);
         }
         if (args.sort) {
            const keys = args.sort[0].split(',');
            const order = args.sort[1].split(',');
            if (keys.length === order.length) {
               options.order = _.zip(keys, order);
            }
         }
         if (args.cursor) {
            options.offset = args.cursor;
         }
         if (args.limit) {
            options.limit = args.limit;
         }
         return await ctx.Models.Manga.findAll({
            ...options,
         });
      },
      manga: (_o, args, ctx) => ctx.Models.Manga.findByPk(args.id),
      search: async (_o, { term }, ctx) => {
         if (!term) {
            return null;
         }
         const options: Fuse.IFuseOptions<any> = {
            useExtendedSearch: true,
            threshold: 0.35,
            keys: ['name'],
            includeScore: true,
         };
         const list = await ctx.Models.Manga.findAll();
         const index = Fuse.createIndex(options.keys, list);
         const fuse = new Fuse(list, options, index);
         const results = fuse.search(term);
         return results.map(e => e.item);
      },
      total: (_o, _a, ctx) => ctx.Models.Manga.count(),
      update: async () => {
         try {
            await updateCovers();
            return true;
         } catch (e) {
            return false;
         }
      },
   },
   Manga: {
      data: (p: any) => mangaData(p),
   },
};

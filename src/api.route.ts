import { Router, Request } from 'express';
import db from './database';
import { dirSync, mangaData, updateCovers } from './lib/folder_lister';
import { URLSearchParams } from 'url';
import _ from 'lodash';
import Fuse from 'fuse.js';
import * as types from './types';
import qs from 'qs';

type IRequest<Query = any, Body = any> = Request<
   any,
   any,
   Body,
   Query,
   Record<string, any>
>;

interface MangasQuery {
   offset?: number;
   limit?: number;
   order?: string | string[] | any[];
   sort?: string | string[];
   refresh?: any;
   _updateCovers?: any;
   page?: number;
}

const route = Router();

export default route;

route.get('/search', async (req, res) => {
   const { query } = req;
   const SearchIndex = await db.find<types.Manga>({});
   const fuse = new Fuse(SearchIndex, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.5,
      useExtendedSearch: true,
   });
   if (_.isString(query.q)) {
      const results = fuse.search(query.q, {
         limit: 20,
      });
      return res.json(results);
   }
   res.json(null);
});

route.get('/mangas', async (req: IRequest<MangasQuery>, res) => {
   const { query } = req;
   console.log(query);
   let results = db.find<types.Manga>({});
   if (query.limit) {
      query.limit = Number(query.limit);
   }
   if (query.offset) {
      query.offset = Number(query.offset);
   }
   if (!query.sort) {
      query.sort = 'createdAt';
   }
   if (!query.order) {
      query.order = '1';
   }
   if (_.has(query, 'refresh')) {
      await db.remove(
         {},
         {
            multi: true,
         }
      );
      const mangaData = await dirSync();
      await db.insert(mangaData);
      results = db.find({});
   }
   if (_.has(query, '_updateCovers')) {
      await updateCovers();
      await db.remove(
         {},
         {
            multi: true,
         }
      );
      const mangaData = await dirSync();
      await db.insert(mangaData);
      results = db.find({});
   }
   if (_.isString(query.sort) && _.isString(query.order)) {
      const keys = query.sort.split(',');
      const order = query.order.split(',');
      if (keys.length === order.length) {
         query.order = _.zip(keys, order.map(Number));
         results = results.sort(
            _.fromPairs<Record<string, number>>(query.order)
         );
      }
   }
   const totalCount = await db.count({});
   res.setHeader('x-total-count', totalCount);
   if (query.page) {
      query.page = Number(query.page);
      if (!query.limit) {
         query.limit = 10;
      }
      query.offset = query.page * query.limit;
      const totalPage = Math.ceil(totalCount / query.limit);
      if (query.page >= totalPage) {
         query.page = totalPage - 1;
      }
      const pageHeaders: Record<
         'last' | 'first' | 'next' | 'prev' | string,
         string | { limit: number; page: number }
      > = {};
      if (query.page + 1 < totalPage) {
         pageHeaders.next = {
            page: query.page + 1,
            limit: query.limit,
         };
      }
      if (query.page > 0 && totalPage > query.page) {
         pageHeaders.prev = {
            page: query.page - 1,
            limit: query.limit,
         };
      }
      pageHeaders.first = {
         page: 0,
         limit: query.limit,
      };
      pageHeaders.last = {
         page: totalPage - 1,
         limit: query.limit,
      };
      res.setHeader('x-total-page', totalPage);
      _.forIn(pageHeaders, (val, key) => {
         res.setHeader(`x-page-${key}`, qs.stringify(val));
      });
      results = results.limit(query.limit).skip(query.offset);
      const json = await results.exec();
      res.jsonp({
         items: json,
         ...pageHeaders,
         total: totalPage,
      });
   } else {
      if (_.isNumber(query.limit)) {
         results = results.limit(query.limit);
      }
      const json = await results.exec();
      res.jsonp({
         items: json,
      });
   }
});
route.get('/manga', async (req, res) => {
   const manga = await db.findOne<types.Manga>({
      id: Number(req.query.id),
   });
   if (manga) {
      const data = await mangaData(manga);
      manga.data = data as any;
      res.jsonp(manga);
   } else {
      res.status(404).json(null);
   }
});

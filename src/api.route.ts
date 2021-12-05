import { Router, Request } from 'express';
import db from './database';
import { dirSync, mangaData, updateCovers } from './lib/folder_lister';
import { URLSearchParams } from 'url';
import _ from 'lodash';
import Fuse from 'fuse.js';
import * as types from './types';

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
   page?: number;
}

const route = Router();

export default route;

route.get('/search', async (req, res) => {
   const { query } = req;
   let SearchIndex = await db.find<types.Manga>({});
   let FuseIndex = Fuse.createIndex(['name'], SearchIndex);
   const fuse = new Fuse(SearchIndex, {
      includeScore: true,
      threshold: 0.35,
      useExtendedSearch: true,
      keys: ['name'],
   });
   FuseIndex.setSources(SearchIndex);
   fuse.setCollection(SearchIndex, FuseIndex);
   if (_.isString(query.q)) {
      const results = fuse.search(query.q, {
         limit: 15,
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
   if (_.has(query, 'refresh') && query.refresh) {
      console.log('refresh');
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
         number
      > = {};
      if (query.page + 1 < totalPage) {
         pageHeaders.next = query.page + 1;
      }
      if (query.page > 0 && totalPage > query.page) {
         pageHeaders.prev = query.page - 1;
      }
      pageHeaders.first = 0;
      pageHeaders.last = totalPage - 1;
      res.setHeader('x-total-page', totalPage);
      _.forIn(pageHeaders, (val, key) => {
         res.setHeader(`x-page-${key}`, val);
      });
      res.setHeader('x-page-limit', query.limit);
      results = results.limit(query.limit).skip(query.offset);
      const json = await results.exec();
      // console.log(json[0]);
      res.jsonp({
         items: json,
         ...pageHeaders,
         total: totalPage,
         limit: query.limit,
         current: query.page,
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

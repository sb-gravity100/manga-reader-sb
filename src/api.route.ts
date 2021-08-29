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
   let results = db.find<types.Manga>({});
   if (query.limit) {
      query.limit = Number(query.limit);
      results.limit(query.limit);
   }
   if (query.offset) {
      query.offset = Number(query.offset);
      results.skip(query.offset);
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
   if (query.page) {
      query.page = Number(query.page);
      if (!query.limit) {
         query.limit = 10;
      }
      query.offset = query.page * query.limit;
      const totalPage = Math.floor(totalCount / query.limit);
      const pageUrl = `${req.protocol}://${req.headers.host}${
         req.url.split('?')[0]
      }`;
      const pageHeaders: Record<string, string> = {};
      if (query.page < totalPage) {
         const pageQuery = new URLSearchParams();
         pageQuery.append('page', (query.page + 1).toString());
         pageQuery.append('limit', query.limit.toString());
         pageHeaders.next = `${pageUrl}?${pageQuery.toString()}`;
      }
      if (query.page > 0) {
         const pageQuery = new URLSearchParams();
         pageQuery.append('page', (query.page - 1).toString());
         pageQuery.append('limit', query.limit.toString());
         pageHeaders.prev = `${pageUrl}?${pageQuery.toString()}`;
      }
      if (query.page !== totalPage) {
         const pageQuery = new URLSearchParams();
         pageQuery.append('page', totalPage.toString());
         pageQuery.append('limit', query.limit.toString());
         pageHeaders.last = `${pageUrl}?${pageQuery.toString()}`;
      }
      if (query.page !== 0) {
         const pageQuery = new URLSearchParams();
         pageQuery.append('page', '0');
         pageQuery.append('limit', query.limit.toString());
         pageHeaders.first = `${pageUrl}?${pageQuery.toString()}`;
      }
      const pageHeaderQuery = _.chain(pageHeaders)
         .toPairs()
         .invokeMap('join', '=')
         .value();
      res.setHeader('x-page-control', pageHeaderQuery);
   }
   res.setHeader('x-total-count', totalCount);
   const json = await results.exec();
   res.jsonp(json);
});
route.get('/manga/:id', async (req, res) => {
   const manga = await db.findOne<types.Manga>({
      id: Number(req.params.id),
   });
   if (manga) {
      const data = await mangaData(manga);
      manga.data = data as any;
      return res.jsonp(manga);
   }
   throw new Error('Manga not found');
});

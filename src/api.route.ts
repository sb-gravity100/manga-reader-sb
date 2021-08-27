import { Router, Request } from 'express';
import { Manga } from './models';
import { sequelize } from './database';
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
   order?: any;
   sort?: string | string[];
   refresh?: any;
   _updateCovers?: any;
   page?: number;
}

const route = Router();
let SearchIndex: types.Manga[] = [];
let FuseIndex = Fuse.createIndex(['name'], SearchIndex);
const fuse = new Fuse(
   SearchIndex,
   {
      keys: ['name'],
      threshold: 0.55,
   },
   FuseIndex
);
export default route;

route.get('/', async (req, res) => {
   const { query } = req;
   if (SearchIndex.length < 1) {
      SearchIndex = _.invokeMap(await Manga.findAll(), 'get');
      FuseIndex = Fuse.createIndex(['name'], SearchIndex);
   }
   if (_.isString(query.q)) {
      fuse.setCollection(SearchIndex, FuseIndex);
      const results = fuse.search(query.q, {
         limit: 10,
      });
      return res.jsonp(results);
   }
   res.jsonp(null);
});

route.get('/mangas', async (req: IRequest<MangasQuery>, res) => {
   const { query } = req;
   if (query.limit) {
      query.limit = Number(query.limit);
   }
   if (query.offset) {
      query.offset = Number(query.offset);
   }
   if (_.has(query, 'refresh')) {
      const data = await dirSync();
      await sequelize.sync({ force: true });
      await Manga.bulkCreate(data);
   }
   if (_.has(query, '_updateCovers')) {
      await updateCovers();
      const data = await dirSync();
      await sequelize.sync({ force: true });
      await Manga.bulkCreate(data);
   }
   if (_.isString(query.sort) && _.isString(query.order)) {
      const keys = query.sort.split(',');
      const order = query.order.split(',');
      if (keys.length === order.length) {
         query.order = _.zip(keys, order);
      }
   }
   const totalCount = await Manga.count();
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
   _.unset(query, 'page');
   _.unset(query, 'refresh');
   _.unset(query, 'sort');
   _.unset(query, '_updateCovers');
   const results = await Manga.findAll({
      ...query,
   });
   res.setHeader('x-total-count', totalCount);
   const json: types.Manga[] = _.invokeMap(results, 'get');
   SearchIndex = [...SearchIndex, ...json];
   res.jsonp(json);
});
route.get('/manga/:id', async (req, res) => {
   const manga = await Manga.findByPk(Number(req.params.id));
   if (manga instanceof Manga) {
      const json = manga.get();
      const data = await mangaData(json as any);
      manga.data = data;
      return res.jsonp(json);
   }
   throw new Error('Manga not found');
});

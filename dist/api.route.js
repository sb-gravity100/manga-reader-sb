"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("./models");
const database_1 = require("./database");
const folder_lister_1 = require("./lib/folder_lister");
const url_1 = require("url");
const lodash_1 = __importDefault(require("lodash"));
const fuse_js_1 = __importDefault(require("fuse.js"));
const route = express_1.Router();
let SearchIndex = [];
let FuseIndex = fuse_js_1.default.createIndex(['name'], SearchIndex);
const fuse = new fuse_js_1.default(SearchIndex, {
    keys: ['name'],
    threshold: 0.55,
    includeScore: true,
    useExtendedSearch: true,
}, FuseIndex);
exports.default = route;
route.get('/', async (req, res) => {
    const { query } = req;
    if (SearchIndex.length < 1) {
        SearchIndex = lodash_1.default.invokeMap(await models_1.Manga.findAll(), 'get');
        FuseIndex = fuse_js_1.default.createIndex(['name'], SearchIndex);
    }
    if (lodash_1.default.isString(query.q)) {
        fuse.setCollection(SearchIndex, FuseIndex);
        const results = fuse.search(query.q, {
            limit: 10,
        });
        return res.jsonp(results);
    }
    res.jsonp(null);
});
route.get('/mangas', async (req, res) => {
    const { query } = req;
    if (query.limit) {
        query.limit = Number(query.limit);
    }
    if (query.offset) {
        query.offset = Number(query.offset);
    }
    if (lodash_1.default.has(query, 'refresh')) {
        const data = await folder_lister_1.dirSync();
        await database_1.sequelize.sync({ force: true });
        await models_1.Manga.bulkCreate(data);
    }
    if (lodash_1.default.has(query, '_updateCovers')) {
        await folder_lister_1.updateCovers();
        const data = await folder_lister_1.dirSync();
        await database_1.sequelize.sync({ force: true });
        await models_1.Manga.bulkCreate(data);
    }
    if (lodash_1.default.isString(query.sort) && lodash_1.default.isString(query.order)) {
        const keys = query.sort.split(',');
        const order = query.order.split(',');
        if (keys.length === order.length) {
            query.order = lodash_1.default.zip(keys, order);
        }
    }
    const totalCount = await models_1.Manga.count();
    if (query.page) {
        query.page = Number(query.page);
        if (!query.limit) {
            query.limit = 10;
        }
        query.offset = query.page * query.limit;
        const totalPage = Math.floor(totalCount / query.limit);
        const pageUrl = `${req.protocol}://${req.headers.host}${req.url.split('?')[0]}`;
        const pageHeaders = {};
        if (query.page < totalPage) {
            const pageQuery = new url_1.URLSearchParams();
            pageQuery.append('page', (query.page + 1).toString());
            pageQuery.append('limit', query.limit.toString());
            pageHeaders.next = `${pageUrl}?${pageQuery.toString()}`;
        }
        if (query.page > 0) {
            const pageQuery = new url_1.URLSearchParams();
            pageQuery.append('page', (query.page - 1).toString());
            pageQuery.append('limit', query.limit.toString());
            pageHeaders.prev = `${pageUrl}?${pageQuery.toString()}`;
        }
        if (query.page !== totalPage) {
            const pageQuery = new url_1.URLSearchParams();
            pageQuery.append('page', totalPage.toString());
            pageQuery.append('limit', query.limit.toString());
            pageHeaders.last = `${pageUrl}?${pageQuery.toString()}`;
        }
        if (query.page !== 0) {
            const pageQuery = new url_1.URLSearchParams();
            pageQuery.append('page', '0');
            pageQuery.append('limit', query.limit.toString());
            pageHeaders.first = `${pageUrl}?${pageQuery.toString()}`;
        }
        const pageHeaderQuery = lodash_1.default.chain(pageHeaders)
            .toPairs()
            .invokeMap('join', '=')
            .value();
        res.setHeader('x-page-control', pageHeaderQuery);
    }
    lodash_1.default.unset(query, 'page');
    lodash_1.default.unset(query, 'refresh');
    lodash_1.default.unset(query, 'sort');
    lodash_1.default.unset(query, '_updateCovers');
    const results = await models_1.Manga.findAll(Object.assign({}, query));
    res.setHeader('x-total-count', totalCount);
    const json = lodash_1.default.invokeMap(results, 'get');
    SearchIndex = [...SearchIndex, ...json];
    res.jsonp(json);
});
route.get('/manga/:id', async (req, res) => {
    const manga = await models_1.Manga.findByPk(Number(req.params.id));
    if (manga instanceof models_1.Manga) {
        const json = manga.get();
        const data = await folder_lister_1.mangaData(json);
        manga.data = data;
        return res.jsonp(json);
    }
    throw new Error('Manga not found');
});
//# sourceMappingURL=api.route.js.map
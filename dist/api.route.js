"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("./database"));
const folder_lister_1 = require("./lib/folder_lister");
const lodash_1 = __importDefault(require("lodash"));
const fuse_js_1 = __importDefault(require("fuse.js"));
const route = (0, express_1.Router)();
exports.default = route;
route.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    let SearchIndex = yield database_1.default.find({});
    let FuseIndex = fuse_js_1.default.createIndex(['name'], SearchIndex);
    const fuse = new fuse_js_1.default(SearchIndex, {
        includeScore: true,
        threshold: 0.35,
        useExtendedSearch: true,
        keys: ['name'],
    });
    FuseIndex.setSources(SearchIndex);
    fuse.setCollection(SearchIndex, FuseIndex);
    if (lodash_1.default.isString(query.q)) {
        const results = fuse.search(query.q, {
            limit: 15,
        });
        return res.json(results);
    }
    res.json(null);
}));
route.get('/mangas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    console.log(query);
    let results = database_1.default.find({});
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
    if (lodash_1.default.has(query, 'refresh') && query.refresh) {
        console.log('refresh');
        yield (0, folder_lister_1.updateCovers)();
        yield database_1.default.remove({}, {
            multi: true,
        });
        const mangaData = yield (0, folder_lister_1.dirSync)();
        yield database_1.default.insert(mangaData);
        results = database_1.default.find({});
    }
    if (lodash_1.default.isString(query.sort) && lodash_1.default.isString(query.order)) {
        const keys = query.sort.split(',');
        const order = query.order.split(',');
        if (keys.length === order.length) {
            query.order = lodash_1.default.zip(keys, order.map(Number));
            results = results.sort(lodash_1.default.fromPairs(query.order));
        }
    }
    const totalCount = yield database_1.default.count({});
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
        const pageHeaders = {};
        if (query.page + 1 < totalPage) {
            pageHeaders.next = query.page + 1;
        }
        if (query.page > 0 && totalPage > query.page) {
            pageHeaders.prev = query.page - 1;
        }
        pageHeaders.first = 0;
        pageHeaders.last = totalPage - 1;
        res.setHeader('x-total-page', totalPage);
        lodash_1.default.forIn(pageHeaders, (val, key) => {
            res.setHeader(`x-page-${key}`, val);
        });
        res.setHeader('x-page-limit', query.limit);
        results = results.limit(query.limit).skip(query.offset);
        const json = yield results.exec();
        // console.log(json[0]);
        res.jsonp(Object.assign(Object.assign({ items: json }, pageHeaders), { total: totalPage, limit: query.limit, current: query.page }));
    }
    else {
        if (lodash_1.default.isNumber(query.limit)) {
            results = results.limit(query.limit);
        }
        const json = yield results.exec();
        res.jsonp({
            items: json,
        });
    }
}));
route.get('/manga', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const manga = yield database_1.default.findOne({
        id: Number(req.query.id),
    });
    if (manga) {
        const data = yield (0, folder_lister_1.mangaData)(manga);
        manga.data = data;
        res.jsonp(manga);
    }
    else {
        res.status(404).json(null);
    }
}));
//# sourceMappingURL=api.route.js.map
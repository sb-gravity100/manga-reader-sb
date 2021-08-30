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
const qs_1 = __importDefault(require("qs"));
const route = express_1.Router();
exports.default = route;
route.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const SearchIndex = yield database_1.default.find({});
    const fuse = new fuse_js_1.default(SearchIndex, {
        keys: ['name'],
        includeScore: true,
        useExtendedSearch: true,
    });
    if (lodash_1.default.isString(query.q)) {
        const results = fuse.search(query.q, {
            limit: 20,
        });
        return res.json(results);
    }
    res.json(null);
}));
route.get('/mangas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    let results = database_1.default.find({});
    if (query.limit) {
        query.limit = Number(query.limit);
        results.limit(query.limit);
    }
    if (query.offset) {
        query.offset = Number(query.offset);
        results.skip(query.offset);
    }
    if (lodash_1.default.has(query, 'refresh')) {
        yield database_1.default.remove({}, {
            multi: true,
        });
        const mangaData = yield folder_lister_1.dirSync();
        yield database_1.default.insert(mangaData);
        results = database_1.default.find({});
    }
    if (lodash_1.default.has(query, '_updateCovers')) {
        yield folder_lister_1.updateCovers();
        yield database_1.default.remove({}, {
            multi: true,
        });
        const mangaData = yield folder_lister_1.dirSync();
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
        const pageUrl = `${req.protocol}://${req.headers.host}${req.url.split('?')[0]}`;
        const pageHeaders = {};
        if (query.page < totalPage) {
            pageHeaders.next = {
                page: query.page + 1,
                limit: query.limit,
            };
        }
        if (query.page > 0 && totalPage > query.page + 1) {
            pageHeaders.prev = {
                page: query.page - 1,
                limit: query.limit,
            };
        }
        if (query.page + 1 !== totalPage) {
            pageHeaders.last = {
                page: totalPage - 1,
                limit: query.limit,
            };
        }
        if (query.page !== 0) {
            pageHeaders.first = {
                page: 0,
                limit: query.limit,
            };
        }
        res.setHeader('x-total-page', totalPage);
        lodash_1.default.forIn(pageHeaders, (val, key) => {
            res.setHeader(`x-page-${key}`, qs_1.default.stringify(val));
        });
        const json = yield results.exec();
        res.jsonp(Object.assign(Object.assign({ items: json }, pageHeaders), { total: totalPage }));
    }
    else {
        const json = yield results.exec();
        res.jsonp(json);
    }
}));
route.get('/manga/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const manga = yield database_1.default.findOne({
        id: Number(req.params.id),
    });
    if (manga) {
        const data = yield folder_lister_1.mangaData(manga);
        manga.data = data;
        return res.jsonp(manga);
    }
    throw new Error('Manga not found');
}));
//# sourceMappingURL=api.route.js.map
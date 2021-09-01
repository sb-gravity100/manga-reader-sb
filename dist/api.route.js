"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var database_1 = __importDefault(require("./database"));
var folder_lister_1 = require("./lib/folder_lister");
var lodash_1 = __importDefault(require("lodash"));
var fuse_js_1 = __importDefault(require("fuse.js"));
var qs_1 = __importDefault(require("qs"));
var route = express_1.Router();
exports.default = route;
route.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, SearchIndex, fuse, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.query;
                return [4 /*yield*/, database_1.default.find({})];
            case 1:
                SearchIndex = _a.sent();
                fuse = new fuse_js_1.default(SearchIndex, {
                    keys: ['name'],
                    includeScore: true,
                    threshold: 0.5,
                    useExtendedSearch: true,
                });
                if (lodash_1.default.isString(query.q)) {
                    results = fuse.search(query.q, {
                        limit: 20,
                    });
                    return [2 /*return*/, res.json(results)];
                }
                res.json(null);
                return [2 /*return*/];
        }
    });
}); });
route.get('/mangas', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, results, mangaData_1, mangaData_2, keys, order, totalCount, totalPage, pageHeaders, json, json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.query;
                console.log(query);
                results = database_1.default.find({});
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
                if (!lodash_1.default.has(query, 'refresh')) return [3 /*break*/, 4];
                return [4 /*yield*/, database_1.default.remove({}, {
                        multi: true,
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, folder_lister_1.dirSync()];
            case 2:
                mangaData_1 = _a.sent();
                return [4 /*yield*/, database_1.default.insert(mangaData_1)];
            case 3:
                _a.sent();
                results = database_1.default.find({});
                _a.label = 4;
            case 4:
                if (!lodash_1.default.has(query, '_updateCovers')) return [3 /*break*/, 9];
                return [4 /*yield*/, folder_lister_1.updateCovers()];
            case 5:
                _a.sent();
                return [4 /*yield*/, database_1.default.remove({}, {
                        multi: true,
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, folder_lister_1.dirSync()];
            case 7:
                mangaData_2 = _a.sent();
                return [4 /*yield*/, database_1.default.insert(mangaData_2)];
            case 8:
                _a.sent();
                results = database_1.default.find({});
                _a.label = 9;
            case 9:
                if (lodash_1.default.isString(query.sort) && lodash_1.default.isString(query.order)) {
                    keys = query.sort.split(',');
                    order = query.order.split(',');
                    if (keys.length === order.length) {
                        query.order = lodash_1.default.zip(keys, order.map(Number));
                        results = results.sort(lodash_1.default.fromPairs(query.order));
                    }
                }
                return [4 /*yield*/, database_1.default.count({})];
            case 10:
                totalCount = _a.sent();
                res.setHeader('x-total-count', totalCount);
                if (!query.page) return [3 /*break*/, 12];
                query.page = Number(query.page);
                if (!query.limit) {
                    query.limit = 10;
                }
                query.offset = query.page * query.limit;
                totalPage = Math.ceil(totalCount / query.limit);
                if (query.page >= totalPage) {
                    query.page = totalPage - 1;
                }
                pageHeaders = {};
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
                lodash_1.default.forIn(pageHeaders, function (val, key) {
                    res.setHeader("x-page-" + key, qs_1.default.stringify(val));
                });
                results = results.limit(query.limit).skip(query.offset);
                return [4 /*yield*/, results.exec()];
            case 11:
                json = _a.sent();
                res.jsonp(__assign(__assign({ items: json }, pageHeaders), { total: totalPage }));
                return [3 /*break*/, 14];
            case 12:
                if (lodash_1.default.isNumber(query.limit)) {
                    results = results.limit(query.limit);
                }
                return [4 /*yield*/, results.exec()];
            case 13:
                json = _a.sent();
                res.jsonp({
                    items: json,
                });
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); });
route.get('/manga', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manga, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.findOne({
                    id: Number(req.query.id),
                })];
            case 1:
                manga = _a.sent();
                if (!manga) return [3 /*break*/, 3];
                return [4 /*yield*/, folder_lister_1.mangaData(manga)];
            case 2:
                data = _a.sent();
                manga.data = data;
                res.jsonp(manga);
                return [3 /*break*/, 4];
            case 3:
                res.status(404).json(null);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=api.route.js.map
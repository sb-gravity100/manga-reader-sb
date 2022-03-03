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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.searchByValues = void 0;
var express_1 = require("express");
var database_1 = __importDefault(require("./database"));
var db2 = __importStar(require("./database"));
var nhentai_1 = require("nhentai");
var doujin = __importStar(require("./lib/doujin"));
var http_errors_1 = __importDefault(require("http-errors"));
var queue_1 = __importDefault(require("queue"));
var axios_1 = __importDefault(require("axios"));
var route = (0, express_1.Router)();
var online = (0, express_1.Router)();
var q = new queue_1.default({
    concurrency: 3,
    autostart: true,
});
exports.default = route;
route.use('/onlineapi', online);
exports.searchByValues = ['artist', 'tag', 'language', 'category', 'parody'];
route.get('/fetch', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.url) return [3 /*break*/, 2];
                return [4 /*yield*/, axios_1.default.get(req.query.url, {
                        responseType: 'arraybuffer',
                    })];
            case 1:
                resp = _a.sent();
                res.setHeader('content-type', resp.headers['content-type']);
                res.send(resp.data);
                return [3 /*break*/, 3];
            case 2:
                res.send();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
route.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, by, result, reg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.query.q;
                by = req.query.by;
                result = [];
                if (!query) {
                    throw new http_errors_1.default.Forbidden('No Input');
                }
                reg = new RegExp(query, 'ig');
                if (!(by && exports.searchByValues.includes(by.toLowerCase()))) return [3 /*break*/, 2];
                return [4 /*yield*/, database_1.default.find({
                        'tags.all': {
                            $elemMatch: {
                                type: by.toLowerCase(),
                                name: reg,
                            },
                        },
                    })];
            case 1:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, database_1.default.find({
                    $or: [
                        {
                            'titles.japanese': reg,
                        },
                        {
                            'titles.pretty': reg,
                        },
                        {
                            'titles.english': reg,
                        },
                    ],
                })];
            case 3:
                result = _a.sent();
                _a.label = 4;
            case 4:
                res.json(result);
                return [2 /*return*/];
        }
    });
}); });
route.get('/mangas', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, limit, _c, page, mangas, total, _d, _e;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = req.query, _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.page, page = _c === void 0 ? 1 : _c;
                mangas = database_1.default.find({}, { raw: 0 }).sort({ createdAt: 1 });
                return [4 /*yield*/, database_1.default.count({})];
            case 1:
                total = _g.sent();
                if (limit) {
                    limit = Number(limit);
                    mangas = mangas.limit(limit);
                }
                if (page) {
                    page = Number(page);
                    mangas = mangas.skip(limit * (page - 1));
                }
                _e = (_d = res).json;
                _f = {};
                return [4 /*yield*/, mangas.exec()];
            case 2:
                _e.apply(_d, [(_f.doujins = (_g.sent()).map(function (e) {
                        e.availableOffline = true;
                        return e;
                    }),
                        _f.doujinsPerPage = limit,
                        _f.numPages = Math.ceil(total / limit),
                        _f)]);
                return [2 /*return*/];
        }
    });
}); });
route.get('/doujin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exist, manga, isOffline;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.findOne({
                    id: Number(req.query.id),
                }, { raw: 0 })];
            case 1:
                exist = _a.sent();
                if (!exist) return [3 /*break*/, 2];
                res.json(__assign(__assign({}, exist), { availableOffline: true }));
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, doujin.api.fetchDoujin(req.query.id)];
            case 3:
                manga = (_a.sent());
                if (!manga) {
                    throw new http_errors_1.default.NotFound('Manga not found');
                }
                return [4 /*yield*/, database_1.default.findOne({ id: manga.id })];
            case 4:
                isOffline = _a.sent();
                console.log(isOffline);
                res.json(__assign(__assign({}, manga), { availableOffline: Boolean(isOffline) }));
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
route.get('/refresh', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mangas, i, e, w, mangas, i, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!('all' === req.query.type)) return [3 /*break*/, 6];
                return [4 /*yield*/, database_1.default.find({})];
            case 1:
                mangas = _a.sent();
                i = mangas.length - 1;
                _a.label = 2;
            case 2:
                if (!(i >= 0)) return [3 /*break*/, 5];
                e = mangas[i];
                return [4 /*yield*/, doujin.write(e.id)];
            case 3:
                w = _a.sent();
                _a.label = 4;
            case 4:
                i--;
                return [3 /*break*/, 2];
            case 5:
                console.log('Refreshed All');
                _a.label = 6;
            case 6:
                if (!('thumb' === req.query.type)) return [3 /*break*/, 12];
                console.log('Refreshed Thumbs');
                return [4 /*yield*/, database_1.default.find({})];
            case 7:
                mangas = _a.sent();
                i = mangas.length - 1;
                _a.label = 8;
            case 8:
                if (!(i >= 0)) return [3 /*break*/, 11];
                e = mangas[i];
                return [4 /*yield*/, doujin.fetchThumbs(new nhentai_1.Doujin(e.raw))];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                i--;
                return [3 /*break*/, 8];
            case 11:
                console.log('Refreshed All');
                _a.label = 12;
            case 12: return [4 /*yield*/, doujin.write(req.query.id)];
            case 13:
                _a.sent();
                console.log('Refreshed: ', req.query.id);
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
route.get('/save', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        q.push(function (cb) { return __awaiter(void 0, void 0, void 0, function () {
            var id, exist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.query.id);
                        return [4 /*yield*/, database_1.default.findOne({
                                id: id,
                            })];
                    case 1:
                        exist = _a.sent();
                        if (exist) {
                            cb(new http_errors_1.default.Conflict('Already exist'));
                        }
                        return [4 /*yield*/, doujin.add(id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.findOne({
                                id: id,
                            })];
                    case 3:
                        exist = _a.sent();
                        res.status(201).json(exist);
                        cb(null, exist);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
route.get('/remove', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, doujin.remove(req.query.id)];
            case 1:
                _res = _a.sent();
                if (_res) {
                    res.json(_res);
                }
                else {
                    throw new http_errors_1.default.NotFound(_res);
                }
                return [2 /*return*/];
        }
    });
}); });
online.get('/tags', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, tags, reg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                q = req.query.q;
                return [4 /*yield*/, db2.tags.find({}, { _id: 0 })];
            case 1:
                tags = _a.sent();
                if (q) {
                    reg = new RegExp(q, 'ig');
                    res.json(tags.filter(function (e) { return reg.test(e.name); }).splice(0, 10));
                }
                else {
                    res.json(tags);
                }
                return [2 /*return*/];
        }
    });
}); });
online.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, q, page, sort, byTag, search, djs;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, q = _a.q, page = _a.page, sort = _a.sort, byTag = _a.byTag;
                if (!q) {
                    throw new http_errors_1.default.Forbidden('No Input');
                }
                return [4 /*yield*/, doujin.api.search(q, page, sort)];
            case 1:
                search = _b.sent();
                return [4 /*yield*/, Promise.all(search.doujins.map(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        var exist;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, database_1.default.findOne({
                                        id: e.id,
                                    })];
                                case 1:
                                    exist = _a.sent();
                                    e['availableOffline'] = !!exist;
                                    return [2 /*return*/, e];
                            }
                        });
                    }); }))];
            case 2:
                djs = _b.sent();
                search['doujins'] = djs;
                res.json(search);
                return [2 /*return*/];
        }
    });
}); });
online.get('/doujin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, manga, isOffline;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.query.id;
                if (!id) {
                    throw new http_errors_1.default.Forbidden('No Input');
                }
                return [4 /*yield*/, doujin.api.fetchDoujin(id)];
            case 1:
                manga = (_a.sent());
                if (!manga) {
                    throw new http_errors_1.default.NotFound('Manga not found');
                }
                return [4 /*yield*/, database_1.default.findOne({ id: manga.id })];
            case 2:
                isOffline = _a.sent();
                res.json(__assign(__assign({}, manga), { availableOffline: Boolean(isOffline) }));
                return [2 /*return*/];
        }
    });
}); });
online.get('/homepage', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, sort, search, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, page = _a.page, sort = _a.sort;
                return [4 /*yield*/, doujin.api.fetchHomepage(page, sort)];
            case 1:
                search = _d.sent();
                _b = search;
                _c = 'doujins';
                return [4 /*yield*/, Promise.all(search.doujins.map(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        var exist;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, database_1.default.findOne({
                                        id: e.id,
                                    })];
                                case 1:
                                    exist = _a.sent();
                                    e['availableOffline'] = !!exist;
                                    return [2 /*return*/, e];
                            }
                        });
                    }); }))];
            case 2:
                _b[_c] = _d.sent();
                res.json(search);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=api.route.js.map
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCovers = exports.mangaData = exports.dirSync = void 0;
require('dotenv').config();
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
var jimp_1 = __importDefault(require("jimp"));
var axios_1 = __importDefault(require("axios"));
// import { randomBytes, randomInt } from 'crypto';
var DJ_PATH = path_1.default.normalize(path_1.default.join(process.cwd(), 'DJ/'));
var API_ENDPOINT = 'https://612dbf2be579e1001791dd78.mockapi.io/';
var mockApi = axios_1.default.create({
    baseURL: API_ENDPOINT,
});
function getDirSize(filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, d;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = fs_1.default
                        .readdirSync(filepath)
                        .map(function (e) { return fs_1.default.promises.stat(path_1.default.join(filepath, e)); });
                    return [4 /*yield*/, Promise.all(dir)];
                case 1:
                    d = _a.sent();
                    return [2 /*return*/, d.map(function (e_1) { return e_1.size; }).reduce(function (p, n) { return p + n; })];
            }
        });
    });
}
function dirSync() {
    return __awaiter(this, void 0, void 0, function () {
        var dir, db, res, promiseFuncs, _loop_1, k;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = [];
                    db = [];
                    if (!process.env.MOCK) return [3 /*break*/, 2];
                    return [4 /*yield*/, mockApi.get('/mangas', {
                            params: {
                                sortBy: 'createdAt',
                                order: 'asc',
                            },
                        })];
                case 1:
                    res = _a.sent();
                    db.push.apply(db, __spreadArray([], __read(res.data.map(function (e) {
                        e.name = e.name.map(lodash_1.default.capitalize).join(' ');
                        e.id = Number(e.id);
                        e.cover = "https://picsum.photos/100/200.webp?random=" + Math.random() * 3;
                        return e;
                    }))));
                    return [3 /*break*/, 5];
                case 2: return [4 /*yield*/, fs_1.default.promises.readdir(DJ_PATH, {
                        withFileTypes: true,
                    })];
                case 3:
                    dir = _a.sent();
                    promiseFuncs = [];
                    _loop_1 = function (k) {
                        var folder = dir[k];
                        var func = function () {
                            return Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var pathname, realPath, birthtime, size, createdAt;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!folder.isDirectory()) return [3 /*break*/, 3];
                                            pathname = path_1.default.join('%DJ_PATH%', folder.name);
                                            realPath = pathname.replace(/%DJ_PATH%/, path_1.default.normalize(DJ_PATH));
                                            return [4 /*yield*/, fs_1.default.promises.stat(realPath)];
                                        case 1:
                                            birthtime = (_a.sent()).birthtime;
                                            return [4 /*yield*/, getDirSize(realPath)];
                                        case 2:
                                            size = _a.sent();
                                            createdAt = new Date(birthtime);
                                            db.push({
                                                name: folder.name,
                                                pathname: pathname,
                                                createdAt: createdAt,
                                                size: size,
                                                cover: "cdn/manga/" + folder.name + "/cover.jpg",
                                            });
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                        };
                        promiseFuncs.push(func());
                    };
                    for (k = dir.length - 1; k >= 0; k--) {
                        _loop_1(k);
                    }
                    return [4 /*yield*/, Promise.all(promiseFuncs)];
                case 4:
                    _a.sent();
                    db = lodash_1.default.sortBy(db, ['createdAt']).map(function (e, i) {
                        e.id = i + 1;
                        return e;
                    });
                    _a.label = 5;
                case 5: 
                // console.log(newDB)
                return [2 /*return*/, db];
            }
        });
    });
}
exports.dirSync = dirSync;
function mangaData(manga) {
    return __awaiter(this, void 0, void 0, function () {
        var mangaPath, data, final;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mangaPath = manga.pathname.replace('%DJ_PATH%', path_1.default.normalize(DJ_PATH));
                    return [4 /*yield*/, fs_1.default.promises.readdir(mangaPath, {
                            withFileTypes: true,
                        })];
                case 1:
                    data = _a.sent();
                    final = data
                        .map(function (file) {
                        if (file.isFile()) {
                            if (file.name !== 'cover.jpg' &&
                                path_1.default.extname(file.name).match(/^\.(jpe?g|png|svg)$/i)) {
                                return {
                                    name: file.name,
                                    path: "cdn/manga/" + path_1.default.basename(mangaPath) + "/" + file.name,
                                };
                            }
                        }
                    })
                        .filter(function (v) { return typeof v !== 'undefined'; });
                    return [2 /*return*/, final];
            }
        });
    });
}
exports.mangaData = mangaData;
function updateCovers() {
    return __awaiter(this, void 0, void 0, function () {
        var dirs, coverdirs, imagePromises, i_1, mangadir, _dir, index, i, cover, cover_file, image, chunks, i_2, chunk;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.default.promises.readdir(DJ_PATH)];
                case 1:
                    dirs = _a.sent();
                    coverdirs = [];
                    imagePromises = [];
                    i_1 = 0;
                    _a.label = 2;
                case 2:
                    if (!(i_1 < dirs.length)) return [3 /*break*/, 5];
                    mangadir = dirs[i_1];
                    return [4 /*yield*/, fs_1.default.promises.readdir(path_1.default.join(DJ_PATH, mangadir))];
                case 3:
                    _dir = _a.sent();
                    index = _dir.findIndex(function (e) { return e.match(/\.(png|jpe?g)$/i); });
                    if (!_dir.find(function (e) { return e === 'cover.jpg'; })) {
                        coverdirs.push(path_1.default.join(DJ_PATH, mangadir, _dir[index]));
                    }
                    _a.label = 4;
                case 4:
                    i_1++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log('Files Read!', coverdirs.length);
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < coverdirs.length)) return [3 /*break*/, 9];
                    cover = coverdirs[i];
                    cover_file = path_1.default.join(path_1.default.dirname(cover), 'cover.jpg');
                    return [4 /*yield*/, jimp_1.default.read(cover)];
                case 7:
                    image = _a.sent();
                    imagePromises.push(image.cover(200, 270).quality(30).writeAsync(cover_file));
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9:
                    chunks = lodash_1.default.chunk(imagePromises, 10);
                    i_2 = chunks.length - 1;
                    _a.label = 10;
                case 10:
                    if (!(i_2 >= 0)) return [3 /*break*/, 13];
                    chunk = chunks[i_2];
                    return [4 /*yield*/, Promise.all(chunk)];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    i_2--;
                    return [3 /*break*/, 10];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.updateCovers = updateCovers;
//# sourceMappingURL=folder_lister.js.map
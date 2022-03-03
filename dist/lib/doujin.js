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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tags = exports.remove = exports.add = exports.write = exports.fetchThumbs = exports.api = void 0;
var nhentai = __importStar(require("nhentai"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var del_1 = __importDefault(require("del"));
var database_1 = __importDefault(require("../database"));
var rax = __importStar(require("retry-axios"));
var axios_1 = __importDefault(require("axios"));
var node_html_parser_1 = require("node-html-parser");
var interceptorId = rax.attach();
nhentai.Image.prototype.fetch = function () {
    return axios_1.default
        .get(this.url, {
        raxConfig: {
            backoffType: 'exponential',
            retry: 100,
        },
        responseType: 'arraybuffer',
    })
        .then(function (e) { return e.data; });
};
nhentai.API.prototype.fetch = function (path) {
    return axios_1.default
        .get(nhentai.API_URL + path, {
        raxConfig: {
            backoffType: 'exponential',
            retry: 100,
        },
        responseType: 'json',
    })
        .then(function (e) { return e.data; });
};
exports.api = new nhentai.API();
var doujinPath = path_1.default.join(process.cwd(), process.env.DJ_PATH || 'gallery');
function fetchThumbs(res) {
    return __awaiter(this, void 0, void 0, function () {
        var a, b, filenameA, filenameB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, res.thumbnail.fetch()];
                case 1:
                    a = _a.sent();
                    return [4 /*yield*/, res.cover.fetch()];
                case 2:
                    b = _a.sent();
                    filenameA = path_1.default.join(doujinPath, res.id.toString(), path_1.default.basename(res.thumbnail.url));
                    filenameB = path_1.default.join(doujinPath, res.id.toString(), path_1.default.basename(res === null || res === void 0 ? void 0 : res.cover.url));
                    return [4 /*yield*/, fs_1.default.promises.writeFile(filenameA, a)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fs_1.default.promises.writeFile(filenameB, b)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.fetchThumbs = fetchThumbs;
function write(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var res, promiseMap, e_1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, exports.api.fetchDoujin(id)];
                case 1:
                    res = (_b.sent());
                    promiseMap = [];
                    return [4 /*yield*/, fs_1.default.promises.mkdir(path_1.default.join(doujinPath, res === null || res === void 0 ? void 0 : res.id.toString()), {
                            recursive: true,
                        })];
                case 2:
                    _b.sent();
                    res === null || res === void 0 ? void 0 : res.pages.forEach(function (e) {
                        var filename = path_1.default.join(doujinPath, res.id.toString(), "".concat(e.pageNumber, ".").concat(e.extension));
                        var done = function () { return __awaiter(_this, void 0, void 0, function () {
                            var d;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, e.fetch()];
                                    case 1:
                                        d = _a.sent();
                                        return [4 /*yield*/, fs_1.default.promises.writeFile(filename, d)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        promiseMap.push(done());
                    });
                    return [4 /*yield*/, fetchThumbs(res)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, Promise.all(promiseMap)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, res];
                case 5:
                    e_1 = _b.sent();
                    console.log((_a = e_1 === null || e_1 === void 0 ? void 0 : e_1.response) === null || _a === void 0 ? void 0 : _a.status);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.write = write;
function add(id) {
    return __awaiter(this, void 0, void 0, function () {
        var res, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 5]);
                    return [4 /*yield*/, write(id)];
                case 1:
                    res = (_a.sent());
                    res.thumbnail.url = "/gallery/".concat(res.id, "/thumb.").concat(res.thumbnail.extension);
                    res.cover.url = "/gallery/".concat(res.id, "/cover.").concat(res.cover.extension);
                    return [4 /*yield*/, database_1.default.insert(__assign(__assign({}, res), { pages: res.pages.map(function (e) {
                                e.originalUrl = e.url;
                                e.url = "/gallery/".concat(res.id, "/").concat(e.pageNumber, ".").concat(e.extension);
                                return e;
                            }), _id: res === null || res === void 0 ? void 0 : res.id }))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    return [4 /*yield*/, remove(id)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.add = add;
function remove(id) {
    return __awaiter(this, void 0, void 0, function () {
        var res, paths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.default.remove({
                        id: Number(id),
                    }, {})];
                case 1:
                    res = _a.sent();
                    if (!fs_1.default.existsSync("".concat(doujinPath, "/").concat(id, "/"))) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, del_1.default)("".concat(doujinPath, "/").concat(id, "/"), {
                            force: true,
                        })];
                case 2:
                    paths = _a.sent();
                    console.log.apply(console, __spreadArray(['Deleted:'], paths, false));
                    _a.label = 3;
                case 3:
                    if (!res) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, Number(id)];
            }
        });
    });
}
exports.remove = remove;
function tags() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var res, results, doc, last, tags, i, res, doc, tags;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, axios_1.default.get('https://nhentai.net/tags/?page=1')];
                case 1:
                    res = _b.sent();
                    results = [];
                    doc = (0, node_html_parser_1.parse)(res.data);
                    last = Number(new URL((_a = doc.querySelector('a.last')) === null || _a === void 0 ? void 0 : _a.getAttribute('href'), 'https://nhentai.net').searchParams.get('page'));
                    tags = Array.from(doc.querySelectorAll('#tag-container .tag')).map(function (e) {
                        var _a, _b, _c;
                        return new nhentai.Tag({
                            name: (_a = e === null || e === void 0 ? void 0 : e.querySelector('.name')) === null || _a === void 0 ? void 0 : _a.textContent.trim(),
                            count: Number((_b = e === null || e === void 0 ? void 0 : e.querySelector('.count')) === null || _b === void 0 ? void 0 : _b.textContent.trim()),
                            id: Number((_c = e === null || e === void 0 ? void 0 : e.getAttribute('class')) === null || _c === void 0 ? void 0 : _c.replace(/tag|\s+|-/gi, '')),
                            type: 'artist',
                            url: e === null || e === void 0 ? void 0 : e.getAttribute('href'),
                        });
                    });
                    results = results.concat(tags);
                    i = 2;
                    _b.label = 2;
                case 2:
                    if (!(i < last - 1)) return [3 /*break*/, 5];
                    return [4 /*yield*/, axios_1.default.get("https://nhentai.net/tags/?page=".concat(i))];
                case 3:
                    res = _b.sent();
                    doc = (0, node_html_parser_1.parse)(res.data);
                    tags = Array.from(doc.querySelectorAll('#tag-container .tag')).map(function (e) {
                        var _a, _b, _c;
                        return new nhentai.Tag({
                            name: (_a = e === null || e === void 0 ? void 0 : e.querySelector('.name')) === null || _a === void 0 ? void 0 : _a.textContent.trim(),
                            count: Number((_b = e === null || e === void 0 ? void 0 : e.querySelector('.count')) === null || _b === void 0 ? void 0 : _b.textContent.trim().replace('K', '000')),
                            id: Number((_c = e === null || e === void 0 ? void 0 : e.getAttribute('class')) === null || _c === void 0 ? void 0 : _c.replace(/tag|\s+|-/gi, '')),
                            type: 'tag',
                            url: e === null || e === void 0 ? void 0 : e.getAttribute('href'),
                        });
                    });
                    results = results.concat(tags);
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, results];
            }
        });
    });
}
exports.tags = tags;
//# sourceMappingURL=doujin.js.map
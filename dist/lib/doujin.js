"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tags = exports.remove = exports.add = exports.write = exports.fetchThumbs = exports.api = void 0;
const nhentai = __importStar(require("nhentai"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const del_1 = __importDefault(require("del"));
const database_1 = __importDefault(require("../database"));
const rax = __importStar(require("retry-axios"));
const axios_1 = __importDefault(require("axios"));
const node_html_parser_1 = require("node-html-parser");
const interceptorId = rax.attach();
nhentai.Image.prototype.fetch = function () {
    return axios_1.default
        .get(this.url, {
        raxConfig: {
            backoffType: 'exponential',
            retry: 100,
        },
        responseType: 'arraybuffer',
    })
        .then((e) => e.data);
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
        .then((e) => e.data);
};
exports.api = new nhentai.API();
var doujinPath = path_1.default.join(process.cwd(), process.env.DJ_PATH || 'gallery');
function fetchThumbs(res) {
    return __awaiter(this, void 0, void 0, function* () {
        var a = yield res.thumbnail.fetch();
        var b = yield res.cover.fetch();
        var filenameA = path_1.default.join(doujinPath, res.id.toString(), path_1.default.basename(res.thumbnail.url));
        var filenameB = path_1.default.join(doujinPath, res.id.toString(), path_1.default.basename(res === null || res === void 0 ? void 0 : res.cover.url));
        yield fs_1.default.promises.writeFile(filenameA, a);
        yield fs_1.default.promises.writeFile(filenameB, b);
    });
}
exports.fetchThumbs = fetchThumbs;
function write(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var res = (yield exports.api.fetchDoujin(id));
            var promiseMap = [];
            yield fs_1.default.promises.mkdir(path_1.default.join(doujinPath, res === null || res === void 0 ? void 0 : res.id.toString()), {
                recursive: true,
            });
            res === null || res === void 0 ? void 0 : res.pages.forEach((e) => {
                var filename = path_1.default.join(doujinPath, res.id.toString(), `${e.pageNumber}.${e.extension}`);
                var done = () => __awaiter(this, void 0, void 0, function* () {
                    var d = yield e.fetch();
                    yield fs_1.default.promises.writeFile(filename, d);
                });
                promiseMap.push(done());
            });
            yield fetchThumbs(res);
            yield Promise.all(promiseMap);
            return res;
        }
        catch (e) {
            console.log((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status);
        }
    });
}
exports.write = write;
function add(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var res = (yield write(id));
            res.thumbnail.url = `/gallery/${res.id}/thumb.${res.thumbnail.extension}`;
            res.cover.url = `/gallery/${res.id}/cover.${res.cover.extension}`;
            yield database_1.default.insert(Object.assign(Object.assign({}, res), { pages: res.pages.map((e) => {
                    e.originalUrl = e.url;
                    e.url = `/gallery/${res.id}/${e.pageNumber}.${e.extension}`;
                    return e;
                }), _id: res === null || res === void 0 ? void 0 : res.id }));
        }
        catch (e) {
            yield remove(id);
        }
    });
}
exports.add = add;
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var res = yield database_1.default.remove({
            id: Number(id),
        }, {});
        if (fs_1.default.existsSync(`${doujinPath}/${id}/`)) {
            var paths = yield (0, del_1.default)(`${doujinPath}/${id}/`, {
                force: true,
            });
            console.log('Deleted:', ...paths);
        }
        if (!res) {
            return false;
        }
        return Number(id);
    });
}
exports.remove = remove;
function tags() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        var res = yield axios_1.default.get('https://nhentai.net/tags/?page=1');
        var results = [];
        var doc = (0, node_html_parser_1.parse)(res.data);
        var last = Number(new URL((_a = doc.querySelector('a.last')) === null || _a === void 0 ? void 0 : _a.getAttribute('href'), 'https://nhentai.net').searchParams.get('page'));
        var tags = Array.from(doc.querySelectorAll('#tag-container .tag')).map((e) => {
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
        for (let i = 2; i < last - 1; i++) {
            var res = yield axios_1.default.get(`https://nhentai.net/tags/?page=${i}`);
            var doc = (0, node_html_parser_1.parse)(res.data);
            var tags = Array.from(doc.querySelectorAll('#tag-container .tag')).map((e) => {
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
        }
        return results;
    });
}
exports.tags = tags;
//# sourceMappingURL=doujin.js.map
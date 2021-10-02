var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
define("database", ["require", "exports", "nedb-promises"], function (require, exports, nedb_promises_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    nedb_promises_1 = __importDefault(nedb_promises_1);
    const db = new nedb_promises_1.default({
        inMemoryOnly: true,
        // timestampData: true,
        // filename: 'data.db',
    });
    exports.default = db;
});
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("lib/folder_lister", ["require", "exports", "path", "fs", "lodash", "jimp", "faker"], function (require, exports, path_1, fs_1, lodash_1, jimp_1, faker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateCovers = exports.mangaData = exports.dirSync = void 0;
    path_1 = __importDefault(path_1);
    fs_1 = __importDefault(fs_1);
    lodash_1 = __importDefault(lodash_1);
    jimp_1 = __importDefault(jimp_1);
    faker_1 = __importDefault(faker_1);
    require('dotenv').config();
    // import { randomBytes, randomInt } from 'crypto';
    const DJ_PATH = path_1.default.normalize(path_1.default.join(process.cwd(), 'DJ/'));
    function getDirSize(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            const dir = fs_1.default
                .readdirSync(filepath)
                .map((e) => fs_1.default.promises.stat(path_1.default.join(filepath, e)));
            const d = yield Promise.all(dir);
            return d.map((e_1) => e_1.size).reduce((p, n) => p + n);
        });
    }
    function dirSync() {
        return __awaiter(this, void 0, void 0, function* () {
            let dir = [];
            let db = [];
            if (process.env.MOCK) {
                db.push(...lodash_1.default.times(lodash_1.default.random(10, 100), (n) => {
                    const name = faker_1.default.helpers.randomize([
                        faker_1.default.commerce.productName(),
                        faker_1.default.company.companyName(),
                        faker_1.default.name.findName(),
                    ]);
                    return {
                        name,
                        pathname: '%DJ_PATH%/' + name,
                        createdAt: faker_1.default.date.past(),
                        size: lodash_1.default.random(100000, 100000000),
                        cover: `https://picsum.photos/100/300.jpg?random=${Math.random()}`,
                        id: n++,
                    };
                }));
            }
            else {
                dir = yield fs_1.default.promises.readdir(DJ_PATH, {
                    withFileTypes: true,
                });
                const promiseFuncs = [];
                for (let k = dir.length - 1; k >= 0; k--) {
                    const folder = dir[k];
                    const func = () => Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
                        if (folder.isDirectory()) {
                            const pathname = path_1.default.join('%DJ_PATH%', folder.name);
                            const realPath = pathname.replace(/%DJ_PATH%/, path_1.default.normalize(DJ_PATH));
                            const { birthtime } = yield fs_1.default.promises.stat(realPath);
                            const size = yield getDirSize(realPath);
                            const createdAt = new Date(birthtime);
                            db.push({
                                name: folder.name,
                                pathname,
                                createdAt,
                                size,
                                cover: `/cdn/manga/${folder.name}/cover.jpg`,
                            });
                        }
                    }));
                    promiseFuncs.push(func());
                }
                yield Promise.all(promiseFuncs);
                db = lodash_1.default.sortBy(db, ['createdAt']).map((e, i) => {
                    e.id = i + 1;
                    return e;
                });
            }
            // console.log(newDB)
            return db;
        });
    }
    exports.dirSync = dirSync;
    function mangaData(manga) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.MOCK) {
                return lodash_1.default.times(lodash_1.default.random(10, 25), (n) => ({
                    name: `0${n++}.jpg`,
                    path: `https://picsum.photos/300/600.jpg?random=${Math.random()}`,
                }));
            }
            const mangaPath = manga.pathname.replace('%DJ_PATH%', path_1.default.normalize(DJ_PATH));
            let data = yield fs_1.default.promises.readdir(mangaPath, {
                withFileTypes: true,
            });
            const final = data
                .map((file) => {
                if (file.isFile()) {
                    if (file.name !== 'cover.jpg' &&
                        path_1.default.extname(file.name).match(/^\.(jpe?g|png|svg)$/i)) {
                        return {
                            name: file.name,
                            path: `/cdn/manga/${path_1.default.basename(mangaPath)}/${file.name}`,
                        };
                    }
                }
            })
                .filter((v) => typeof v !== 'undefined');
            return final;
        });
    }
    exports.mangaData = mangaData;
    function updateCovers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.MOCK) {
                const dirs = (yield fs_1.default.promises.readdir(DJ_PATH, {
                    withFileTypes: true,
                })).filter((e) => e.isDirectory());
                const coverdirs = [];
                const imagePromises = [];
                for (let i = 0; i < dirs.length; i++) {
                    const mangadir = dirs[i];
                    const _dir = yield fs_1.default.promises.readdir(path_1.default.join(DJ_PATH, mangadir.name));
                    const index = _dir.findIndex((e) => e.match(/\.(png|jpe?g)$/i));
                    if (!_dir.find((e) => e === 'cover.jpg')) {
                        coverdirs.push(path_1.default.join(DJ_PATH, mangadir.name, _dir[index]));
                    }
                }
                console.log('Files Read!', coverdirs.length);
                for (var i = 0; i < coverdirs.length; i++) {
                    const cover = coverdirs[i];
                    const cover_file = path_1.default.join(path_1.default.dirname(cover), 'cover.jpg');
                    const image = yield jimp_1.default.read(cover);
                    imagePromises.push(image.cover(200, 270).quality(30).writeAsync(cover_file));
                }
                const chunks = lodash_1.default.chunk(imagePromises, 10);
                for (let i = chunks.length - 1; i >= 0; i--) {
                    const chunk = chunks[i];
                    yield Promise.all(chunk);
                }
            }
        });
    }
    exports.updateCovers = updateCovers;
});
define("api.route", ["require", "exports", "express", "database", "lib/folder_lister", "lodash", "fuse.js"], function (require, exports, express_1, database_1, folder_lister_1, lodash_2, fuse_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    database_1 = __importDefault(database_1);
    lodash_2 = __importDefault(lodash_2);
    fuse_js_1 = __importDefault(fuse_js_1);
    const route = (0, express_1.Router)();
    let SearchIndex = [];
    let FuseIndex = [];
    const fuse = new fuse_js_1.default(SearchIndex, {
        includeScore: true,
        threshold: 0.4,
        useExtendedSearch: true,
        keys: ['name'],
    }, fuse_js_1.default.createIndex(['name'], FuseIndex));
    exports.default = route;
    route.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req;
        if (SearchIndex.length === 0) {
            FuseIndex = SearchIndex = yield database_1.default.find({});
            fuse.setCollection(SearchIndex, fuse_js_1.default.createIndex(['name'], FuseIndex));
        }
        if (lodash_2.default.isString(query.q)) {
            const results = fuse.search(query.q, {
                limit: 20,
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
        if (lodash_2.default.has(query, 'refresh')) {
            yield database_1.default.remove({}, {
                multi: true,
            });
            const mangaData = yield (0, folder_lister_1.dirSync)();
            yield database_1.default.insert(mangaData);
            results = database_1.default.find({});
            FuseIndex = SearchIndex = yield results;
        }
        if (lodash_2.default.has(query, '_updateCovers')) {
            yield (0, folder_lister_1.updateCovers)();
            yield database_1.default.remove({}, {
                multi: true,
            });
            const mangaData = yield (0, folder_lister_1.dirSync)();
            yield database_1.default.insert(mangaData);
            results = database_1.default.find({});
        }
        if (lodash_2.default.isString(query.sort) && lodash_2.default.isString(query.order)) {
            const keys = query.sort.split(',');
            const order = query.order.split(',');
            if (keys.length === order.length) {
                query.order = lodash_2.default.zip(keys, order.map(Number));
                results = results.sort(lodash_2.default.fromPairs(query.order));
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
            lodash_2.default.forIn(pageHeaders, (val, key) => {
                res.setHeader(`x-page-${key}`, val);
            });
            res.setHeader('x-page-limit', query.limit);
            results = results.limit(query.limit).skip(query.offset);
            const json = yield results.exec();
            res.jsonp(Object.assign(Object.assign({ items: json }, pageHeaders), { total: totalPage, limit: query.limit }));
        }
        else {
            if (lodash_2.default.isNumber(query.limit)) {
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
});
define("server", ["require", "exports", "express", "path", "http-errors", "cors", "morgan", "compression", "lodash", "database", "lib/folder_lister", "api.route"], function (require, exports, express_2, path_2, http_errors_1, cors_1, morgan_1, compression_1, lodash_3, database_2, folder_lister_2, api_route_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    express_2 = __importDefault(express_2);
    http_errors_1 = __importDefault(http_errors_1);
    cors_1 = __importDefault(cors_1);
    morgan_1 = __importDefault(morgan_1);
    compression_1 = __importDefault(compression_1);
    lodash_3 = __importDefault(lodash_3);
    database_2 = __importDefault(database_2);
    api_route_1 = __importDefault(api_route_1);
    require('dotenv').config();
    require('express-async-errors');
    console.log(process.cwd());
    const { NODE_ENV, PORT = 7800 } = process.env;
    const CWD = process.cwd();
    const Join = (...dir) => (0, path_2.normalize)((0, path_2.join)(CWD, ...dir));
    const DJ_PATH = Join('DJ/');
    const port = PORT;
    const ASSETS_PATH = Join('public/');
    const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
    debug('Starting...');
    const boot = () => __awaiter(void 0, void 0, void 0, function* () {
        const app = (0, express_2.default)();
        yield database_2.default.ensureIndex({
            fieldName: 'id',
            unique: true,
        });
        yield database_2.default.remove({}, { multi: true });
        const mangaData = yield (0, folder_lister_2.dirSync)();
        yield database_2.default.insert(mangaData);
        debug('Database ready!');
        yield new Promise((res) => app.listen(Number(PORT), res));
        debug(`Server listening at %s`, port);
        return app;
    });
    boot()
        .then((app) => {
        app.use((0, cors_1.default)());
        app.use((0, morgan_1.default)('dev', {
            skip: (req) => {
                if (req.url.length > 50) {
                    return true;
                }
                return false;
            },
            stream: {
                write: (msg) => debug(msg.trimEnd()),
            },
        }));
        app.use((0, compression_1.default)());
        app.use('/cdn/manga', express_2.default.static(DJ_PATH));
        app.use(express_2.default.static(ASSETS_PATH));
        app.get('/(*/)?', (_req, res) => res.sendFile((0, path_2.join)(ASSETS_PATH, 'index.html')));
        app.get('/manga', (_req, res) => res.sendFile((0, path_2.join)(ASSETS_PATH, 'index.html')));
        app.use('/api', api_route_1.default);
        app.use((_req, _res, next) => next((0, http_errors_1.default)(404)));
        app.use((err, _req, res, _next) => {
            const Errors = Object.assign({}, err);
            console.log(err);
            res.status(err.status || 500).json(Errors);
        });
    })
        .catch((e) => {
        if (lodash_3.default.has(e, 'sql')) {
            lodash_3.default.unset(e, 'sql');
            lodash_3.default.unset(e, 'parent');
            lodash_3.default.unset(e, 'stack');
            lodash_3.default.unset(e, 'original');
        }
        console.log(e);
        process.exit();
    });
});
define("lib/renamer", ["require", "exports", "fs", "path"], function (require, exports, fs_2, path_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    fs_2 = __importDefault(fs_2);
    path_3 = __importDefault(path_3);
    const dirs = fs_2.default.readdirSync('./');
    console.log(dirs);
    const renamer = () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < dirs.length; i++) {
            const filename = dirs[i];
            if (filename.match(/\.fdm\w+$/i)) {
                const oldPath = path_3.default.join(__dirname, filename);
                const newPath = path_3.default.join('./', filename.replace(/\.fdmdownload/gi, ''));
                yield fs_2.default.promises.rename(oldPath, newPath);
                console.log('Renamed %s to %s', filename, filename.replace(/\.fdmdownload/gi, ''));
            }
        }
    });
    renamer().catch(console.log);
});
//# sourceMappingURL=index.js.map
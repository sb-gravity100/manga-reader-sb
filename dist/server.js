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
require('dotenv').config();
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const lodash_1 = __importDefault(require("lodash"));
const database_1 = __importDefault(require("./database"));
const folder_lister_1 = require("./lib/folder_lister");
const api_route_1 = __importDefault(require("./api.route"));
console.log(process.cwd());
const { NODE_ENV, PORT } = process.env;
const CWD = process.cwd();
const Join = (...dir) => path_1.normalize(path_1.join(CWD, ...dir));
const DJ_PATH = Join('DJ/');
const port = PORT;
const ASSETS_PATH = Join('public/');
const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');
const boot = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    yield database_1.default.ensureIndex({
        fieldName: 'id',
        unique: true,
    });
    yield database_1.default.remove({}, {
        multi: true,
    });
    const mangaData = yield folder_lister_1.dirSync();
    yield database_1.default.insert(mangaData);
    debug('Database ready!');
    yield new Promise((res) => app.listen(Number(PORT), res));
    debug(`Server listening at %s`, port);
    return app;
});
boot()
    .then((app) => {
    app.use(cors_1.default());
    app.use(morgan_1.default('dev', {
        skip: (req) => {
            if (req.url.length > 50) {
                return false;
            }
            return true;
        },
        stream: {
            write: (msg) => debug(msg.trimEnd()),
        },
    }));
    app.use(compression_1.default());
    app.use('/cdn/manga', express_1.default.static(DJ_PATH));
    app.use(express_1.default.static(ASSETS_PATH));
    app.get('/(*/)?', (_req, res) => res.sendFile(path_1.join(ASSETS_PATH, 'index.html')));
    app.get('/manga', (_req, res) => res.sendFile(path_1.join(ASSETS_PATH, 'index.html')));
    app.use('/api', api_route_1.default);
    app.use((_req, _res, next) => next(http_errors_1.default(404)));
    app.use((err, _req, res, _next) => {
        const Errors = Object.assign({}, err);
        res.status(err.status || 500).json(Errors);
    });
})
    .catch((e) => {
    if (lodash_1.default.has(e, 'sql')) {
        lodash_1.default.unset(e, 'sql');
        lodash_1.default.unset(e, 'parent');
        lodash_1.default.unset(e, 'stack');
        lodash_1.default.unset(e, 'original');
    }
    console.log(e);
    process.exit();
});
//# sourceMappingURL=server.js.map
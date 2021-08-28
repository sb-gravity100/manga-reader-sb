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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require('express-async-errors');
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const lodash_1 = __importDefault(require("lodash"));
const database_1 = require("./database");
const Models = __importStar(require("./models"));
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
const boot = async () => {
    const app = express_1.default();
    const mangaData = await folder_lister_1.dirSync();
    await database_1.sequelize.sync({ force: true });
    await Models.Manga.bulkCreate(mangaData);
    debug('Database ready!');
    await new Promise(res => app.listen(Number(PORT), res));
    debug(`Server listening at %s`, port);
    return app;
};
boot()
    .then(app => {
    app.use(cors_1.default());
    app.use(morgan_1.default('dev'));
    app.use(compression_1.default({
        level: 7,
    }));
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
    .catch(e => {
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
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
const database_1 = __importDefault(require("./database"));
const api_route_1 = __importDefault(require("./api.route"));
console.log(process.cwd());
const { NODE_ENV, PORT = 7800 } = process.env;
const CWD = process.cwd();
const Join = (...dir) => (0, path_1.normalize)((0, path_1.join)(CWD, ...dir));
const DJ_PATH = Join('DJ/');
const port = PORT;
const ASSETS_PATH = Join('public/');
const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');
const isGitpod = /gitpod/i.test(process.env.USER);
const boot = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(isGitpod);
    const app = (0, express_1.default)();
    yield database_1.default.load();
    yield database_1.default.ensureIndex({
        fieldName: 'id',
        unique: true,
    });
    // const mangaData = await dirSync();
    // await db.insert(mangaData);
    // debug('Database ready!');
    yield new Promise((res) => app.listen(Number(PORT), res));
    debug(`Server listening at %s`, port);
    return app;
});
boot()
    .then((app) => {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
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
    app.use('/cdn/manga', express_1.default.static(DJ_PATH));
    app.use(express_1.default.static(ASSETS_PATH));
    app.get('/(*/)?', (_req, res) => res.sendFile((0, path_1.join)(ASSETS_PATH, 'index.html')));
    app.use('/api', api_route_1.default);
    app.use((_req, _res, next) => next((0, http_errors_1.default)(404)));
    app.use((err, _req, res, _next) => {
        var error = {};
        for (var x in err) {
            error[x] = err[x];
        }
        // console.log(err);
        res.status(err.status || 500).send(error);
    });
})
    .catch(console.log);
//# sourceMappingURL=server.js.map
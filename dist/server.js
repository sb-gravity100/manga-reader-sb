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
require('dotenv').config();
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
// import _ from "lodash";
const database_1 = __importDefault(require("./database"));
const db = __importStar(require("./database"));
const doujin = __importStar(require("./lib/doujin"));
const api_route_1 = __importDefault(require("./api.route"));
console.log(process.cwd());
var { NODE_ENV, PORT = 7800, DJ_PATH = 'gallery' } = process.env;
var CWD = process.cwd();
var Join = (...dir) => (0, path_1.normalize)((0, path_1.join)(CWD, ...dir));
DJ_PATH = Join(DJ_PATH);
var port = PORT;
var ASSETS_PATH = Join('public/');
var debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');
var isGitpod = /gitpod/i.test(process.env.USER);
var boot = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // console.log(isGitpod);
    var app = (0, express_1.default)();
    yield database_1.default.load();
    yield database_1.default.ensureIndex({
        fieldName: 'id',
        unique: true,
    });
    yield ((_a = db.tags) === null || _a === void 0 ? void 0 : _a.load());
    yield ((_b = db.tags) === null || _b === void 0 ? void 0 : _b.insert(yield doujin.tags()));
    // var mangaData = await dirSync();
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
            if (req.url.match(/gallery/i)) {
                return true;
            }
            return false;
        },
        stream: {
            write: (msg) => debug(msg.trimEnd()),
        },
    }));
    app.use((0, compression_1.default)());
    app.use('/gallery', express_1.default.static(DJ_PATH));
    app.use(express_1.default.static(ASSETS_PATH));
    app.use('/api', api_route_1.default);
    app.get('/*?', (_req, res) => res.sendFile((0, path_1.join)(ASSETS_PATH, 'index.html')));
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
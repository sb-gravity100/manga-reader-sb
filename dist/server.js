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
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const path_1 = require("path");
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const graphql_1 = __importDefault(require("./graphql"));
// const { mangaData } = require('./lib/folder_lister');
const { NODE_ENV, PORT } = process.env;
const DJ_PATH = path_1.normalize(path_1.join(__dirname, 'DJ/'));
const port = PORT;
const Join = (...dir) => path_1.normalize(path_1.join(__dirname, ...dir));
const ASSETS_PATH = Join('public/');
const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');
const startApollo = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    const schema = yield graphql_1.default();
    const apollo = new apollo_server_express_1.ApolloServer({
        schema,
        playground: false /* NODE_ENV === 'development' && {
           title: 'MangaQL',
           cdnUrl: '/api/_apollo',
           settings: {
              "editor.fontFamily": "'Jetbrains Mono', 'Ubuntu Mono', Consolas, monospace",
              "editor.fontSize": 12
           }
        } */,
        introspection: NODE_ENV === 'development',
        tracing: true,
    });
    yield apollo.start();
    apollo.applyMiddleware({ app, path: '/api/ql' });
    yield new Promise(res => app.listen(PORT, res));
    debug(`Apollo server ready at %s`, apollo.graphqlPath);
    debug(`Server listening at %s`, port);
    return { app, apollo };
});
startApollo().then(({ app }) => {
    app.use(morgan_1.default('dev', {
        stream: {
            write: msg => debug(msg.trimEnd()),
        },
    }));
    app.use(compression_1.default());
    app.use(cors_1.default());
    app.use('/cdn/manga', express_1.default.static(DJ_PATH));
    app.use(express_1.default.static(ASSETS_PATH));
    app.get('/(*/)?', (_req, res) => res.sendFile(ASSETS_PATH + 'index.html'));
    app.get('/manga', (_req, res) => res.sendFile(ASSETS_PATH + 'index.html'));
    app.use((_req, _res, next) => {
        next(http_errors_1.default(404));
    });
    app.use((err, _req, res, _next) => res.status(err.status || 500).json(err));
});
//# sourceMappingURL=server.js.map
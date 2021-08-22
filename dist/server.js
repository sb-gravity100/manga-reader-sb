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
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const path_1 = require("path");
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const graphql_1 = __importDefault(require("./graphql"));
const lodash_1 = __importDefault(require("lodash"));
const chalk_1 = __importDefault(require("chalk"));
const database_1 = __importDefault(require("./database"));
const Models = __importStar(require("./models"));
const folder_lister_1 = require("./lib/folder_lister");
console.log(process.cwd());
const { NODE_ENV, PORT, DB_PASS, DB_USER } = process.env;
const CWD = process.cwd();
const Join = (...dir) => path_1.normalize(path_1.join(CWD, ...dir));
const DJ_PATH = Join('DJ/');
const port = PORT;
const ASSETS_PATH = Join('public/');
const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');
const startApollo = async () => {
    const app = express_1.default();
    const schema = await graphql_1.default();
    const mangaData = await folder_lister_1.dirSync();
    const sequelize = database_1.default(DB_USER, 'btstaehyung1', Object.values(Object.assign({}, Models)));
    await sequelize.sync({ force: true });
    await Models.Manga.bulkCreate(mangaData);
    debug('Database ready!');
    const apollo = new apollo_server_express_1.ApolloServer({
        schema,
        playground: false,
        introspection: NODE_ENV === 'development',
        tracing: true,
        context: {
            Models,
            sequelize,
        },
    });
    await apollo.start();
    apollo.applyMiddleware({ app, path: '/api/ql' });
    await new Promise(res => app.listen(PORT, res));
    debug(`Apollo server ready at %s`, apollo.graphqlPath);
    debug(`Server listening at %s`, port);
    return { app, apollo };
};
function Logger(logger = console.log) {
    return (req, _res, next) => {
        const { method, statusCode, url } = req;
        let statusColor;
        if (statusCode >= 100) {
            statusColor = 'whiteBright';
        }
        if (statusCode >= 200) {
            statusColor = 'greenBright';
        }
        if (statusCode >= 300) {
            statusColor = 'cyan';
        }
        if (statusCode >= 400) {
            statusColor = 'yellow';
        }
        if (statusCode >= 500) {
            statusColor = 'redBright';
        }
        logger(`${method} ${chalk_1.default[statusColor](statusCode)} - ${url}`);
        next();
    };
}
startApollo()
    .then(({ app }) => {
    app.use(Logger(debug));
    app.use(cors_1.default());
    app.use('/cdn/manga', express_1.default.static(DJ_PATH));
    app.use(express_1.default.static(ASSETS_PATH));
    app.get('/(*/)?', (_req, res) => res.sendFile(path_1.join(ASSETS_PATH, 'index.html')));
    app.get('/manga', (_req, res) => res.sendFile(path_1.join(ASSETS_PATH, 'index.html')));
    app.use((_req, _res, next) => {
        next(http_errors_1.default(404));
    });
    app.use((err, _req, res, _next) => res.status(err.status || 500).json(err));
})
    .catch(e => {
    if (lodash_1.default.has(e, 'sql')) {
        lodash_1.default.unset(e, 'sql');
        lodash_1.default.unset(e, 'parent');
        lodash_1.default.unset(e, 'stack');
        lodash_1.default.unset(e, 'original');
    }
    console.log(e);
});
//# sourceMappingURL=server.js.map
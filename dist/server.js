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
require('dotenv').config();
require('express-async-errors');
var express_1 = __importDefault(require("express"));
var path_1 = require("path");
var http_errors_1 = __importDefault(require("http-errors"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var compression_1 = __importDefault(require("compression"));
var lodash_1 = __importDefault(require("lodash"));
var database_1 = __importDefault(require("./database"));
var folder_lister_1 = require("./lib/folder_lister");
var api_route_1 = __importDefault(require("./api.route"));
console.log(process.cwd());
var _a = process.env, NODE_ENV = _a.NODE_ENV, PORT = _a.PORT;
var CWD = process.cwd();
var Join = function () {
    var dir = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        dir[_i] = arguments[_i];
    }
    return path_1.normalize(path_1.join.apply(void 0, __spreadArray([CWD], __read(dir))));
};
var DJ_PATH = Join('DJ/');
var port = PORT;
var ASSETS_PATH = Join('public/');
var debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');
var boot = function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, mangaData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = express_1.default();
                return [4 /*yield*/, database_1.default.ensureIndex({
                        fieldName: 'id',
                        unique: true,
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, database_1.default.remove({}, { multi: true })];
            case 2:
                _a.sent();
                return [4 /*yield*/, folder_lister_1.dirSync()];
            case 3:
                mangaData = _a.sent();
                return [4 /*yield*/, database_1.default.insert(mangaData)];
            case 4:
                _a.sent();
                debug('Database ready!');
                return [4 /*yield*/, new Promise(function (res) { return app.listen(Number(PORT), res); })];
            case 5:
                _a.sent();
                debug("Server listening at %s", port);
                return [2 /*return*/, app];
        }
    });
}); };
boot()
    .then(function (app) {
    app.use(cors_1.default());
    app.use(morgan_1.default('dev', {
        skip: function (req) {
            if (req.url.length > 50) {
                return true;
            }
            return false;
        },
        stream: {
            write: function (msg) { return debug(msg.trimEnd()); },
        },
    }));
    app.use(compression_1.default());
    app.use('/cdn/manga', express_1.default.static(DJ_PATH));
    app.use(express_1.default.static(ASSETS_PATH));
    app.get('/(*/)?', function (_req, res) {
        return res.sendFile(path_1.join(ASSETS_PATH, 'index.html'));
    });
    app.get('/manga', function (_req, res) {
        return res.sendFile(path_1.join(ASSETS_PATH, 'index.html'));
    });
    app.use('/api', api_route_1.default);
    app.use(function (_req, _res, next) { return next(http_errors_1.default(404)); });
    app.use(function (err, _req, res, _next) {
        var Errors = __assign({}, err);
        console.log(err);
        res.status(err.status || 500).json(Errors);
    });
})
    .catch(function (e) {
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
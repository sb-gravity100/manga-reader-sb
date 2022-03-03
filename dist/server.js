"use strict";
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
require('dotenv').config();
require('express-async-errors');
var express_1 = __importDefault(require("express"));
var path_1 = require("path");
var http_errors_1 = __importDefault(require("http-errors"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var compression_1 = __importDefault(require("compression"));
// import _ from "lodash";
var database_1 = __importDefault(require("./database"));
var db = __importStar(require("./database"));
var doujin = __importStar(require("./lib/doujin"));
var api_route_1 = __importDefault(require("./api.route"));
console.log(process.cwd());
var _a = process.env, NODE_ENV = _a.NODE_ENV, _b = _a.PORT, PORT = _b === void 0 ? 7800 : _b, _c = _a.DJ_PATH, DJ_PATH = _c === void 0 ? 'gallery' : _c;
var CWD = process.cwd();
var Join = function () {
    var dir = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        dir[_i] = arguments[_i];
    }
    return (0, path_1.normalize)(path_1.join.apply(void 0, __spreadArray([CWD], dir, false)));
};
DJ_PATH = Join(DJ_PATH);
var port = PORT;
var ASSETS_PATH = Join('public/');
var debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');
var isGitpod = /gitpod/i.test(process.env.USER);
var boot = function () { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                app = (0, express_1.default)();
                return [4 /*yield*/, database_1.default.load()];
            case 1:
                _b.sent();
                return [4 /*yield*/, database_1.default.ensureIndex({
                        fieldName: 'id',
                        unique: true,
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, ((_a = db.tags) === null || _a === void 0 ? void 0 : _a.load())];
            case 3:
                _b.sent();
                // var mangaData = await dirSync();
                // await db.insert(mangaData);
                // debug('Database ready!');
                return [4 /*yield*/, new Promise(function (res) { return app.listen(Number(PORT), res); })];
            case 4:
                // var mangaData = await dirSync();
                // await db.insert(mangaData);
                // debug('Database ready!');
                _b.sent();
                debug("Server listening at %s", port);
                return [2 /*return*/, app];
        }
    });
}); };
boot()
    .then(function (app) {
    doujin
        .tags()
        .then(function (e) { return db.tags.insert(e); })
        .catch(console.log);
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, morgan_1.default)('dev', {
        skip: function (req) {
            if (req.url.length > 50) {
                return true;
            }
            if (req.url.match(/gallery/i)) {
                return true;
            }
            return false;
        },
        stream: {
            write: function (msg) { return debug(msg.trimEnd()); },
        },
    }));
    app.use((0, compression_1.default)());
    app.use('/gallery', express_1.default.static(DJ_PATH));
    app.use(express_1.default.static(ASSETS_PATH));
    app.use('/api', api_route_1.default);
    app.get('/*?', function (_req, res) {
        return res.sendFile((0, path_1.join)(ASSETS_PATH, 'index.html'));
    });
    app.use(function (_req, _res, next) { return next((0, http_errors_1.default)(404)); });
    app.use(function (err, _req, res, _next) {
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
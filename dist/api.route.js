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
const express_1 = require("express");
const database_1 = __importDefault(require("./database"));
const doujin = __importStar(require("./lib/doujin"));
const http_errors_1 = __importDefault(require("http-errors"));
const queue_1 = __importDefault(require("queue"));
var route = (0, express_1.Router)();
var online = (0, express_1.Router)();
var q = new queue_1.default({
    concurrency: 3,
    autostart: true
});
exports.default = route;
route.use("/online", online);
var searchByValues = ["artist", "tag", "language", "category", "parody"];
route.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var query = req.query.q;
    var by = req.query.by;
    var result = [];
    if (!query) {
        throw new http_errors_1.default.Forbidden("No Input");
    }
    var reg = new RegExp(query, "ig");
    if (by && searchByValues.includes(by.toLowerCase())) {
        result = yield database_1.default.find({
            "tags.all": {
                $elemMatch: {
                    type: by.toLowerCase(),
                    name: reg,
                },
            },
        });
    }
    else {
        result = yield database_1.default.find({
            $or: [
                {
                    "titles.japanese": reg,
                },
                {
                    "titles.pretty": reg,
                },
                {
                    "titles.english": reg,
                },
            ],
        });
    }
    res.json(result);
}));
route.get("/mangas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { limit = 10, page = 1 } = req.query;
    var mangas = database_1.default.find({}, { raw: 0 });
    var total = yield database_1.default.count({});
    if (limit) {
        limit = Number(limit);
        mangas = mangas.limit(limit);
    }
    if (page) {
        page = Number(page);
        mangas = mangas.skip(limit * (page - 1));
    }
    res.json({
        doujins: (yield mangas.exec()),
        doujinsPerPage: limit,
        numPages: Math.ceil(total / limit),
    });
}));
route.get("/manga", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var exist = yield database_1.default.findOne({
        id: Number(req.query.id),
    }, { raw: 0 });
    if (exist) {
        res.json(exist);
    }
    else {
        throw new http_errors_1.default.NotFound("Manga not found!");
    }
}));
route.get('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield doujin.write(req.query.id);
    res.status(200).send();
}));
route.get("/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    q.push((cb) => __awaiter(void 0, void 0, void 0, function* () {
        var id = Number(req.query.id);
        var exist = yield database_1.default.findOne({
            id,
        });
        if (exist) {
            cb(new http_errors_1.default.Conflict("Already exist"));
        }
        yield doujin.add(id);
        exist = yield database_1.default.findOne({
            id,
        });
        res.status(201).json(exist);
        cb(null, exist);
    }));
}));
route.get("/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _res = yield doujin.remove(req.query.id);
    if (_res) {
        res.json(_res);
    }
    else {
        throw new http_errors_1.default.NotFound(_res);
    }
}));
online.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { q, page, sort } = req.query;
    if (!q) {
        throw new http_errors_1.default.Forbidden("No Input");
    }
    var search = yield doujin.api.search(q, page, sort);
    res.json(search);
}));
online.get("/manga", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { id } = req.query;
    if (!id) {
        throw new http_errors_1.default.Forbidden("No Input");
    }
    var manga = (yield doujin.api.fetchDoujin(id));
    if (!manga) {
        throw new http_errors_1.default.NotFound("Manga not found");
    }
    var isOffline = yield database_1.default.find({ id: manga.id });
    res.json(Object.assign(Object.assign({}, manga), { availableOffline: Boolean(isOffline) }));
}));
online.get("/homepage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { page, sort } = req.query;
    var search = yield doujin.api.fetchHomepage(page, sort);
    res.json(search);
}));
//# sourceMappingURL=api.route.js.map
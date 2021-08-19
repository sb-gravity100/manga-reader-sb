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
exports.resolvers = void 0;
const folder_lister_1 = require("../lib/folder_lister");
const db_1 = __importDefault(require("../db"));
const lodash_1 = __importDefault(require("lodash"));
const graphql_scalars_1 = require("graphql-scalars");
exports.resolvers = {};
exports.resolvers.DateTime = graphql_scalars_1.DateTimeResolver;
exports.resolvers.Query.mangas = (_o, args) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.read();
    const db = db_1.default.chain();
    let folders;
    if (args && args.refresh) {
        folders = folder_lister_1.dirSync();
        db.set('list', folders);
    }
    else {
        folders = db.get('list').value();
    }
    if (lodash_1.default.isString(args.sort)) {
        let orders = [[], []];
        args.sort
            .replace(/\s+/gi, ' ')
            .replace(/^\s*/gi, '')
            .replace(/\s*,\s*/gi, ',')
            .split(',')
            .map(v => v.trim().split(' '))
            .forEach(v => {
            orders[0].push(v[0]);
            orders[1].push(v[1]);
        });
        // console.log(orders)
        folders = lodash_1.default.chain(folders)
            .orderBy(...orders)
            .value();
    }
    if (typeof args.cursor === 'number') {
        folders = lodash_1.default.slice(folders, args.cursor);
    }
    if (args.limit) {
        folders = lodash_1.default.take(folders, args.limit);
    }
    yield db_1.default.write();
    return folders;
});
exports.resolvers.Query.manga = (_o, args) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.read();
    const db = db_1.default.chain();
    return db.get('list').find({ id: args.id }).value();
});
exports.resolvers.Query.search = (_o, { term }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!term) {
        return null;
    }
    yield db_1.default.read();
    const db = db_1.default.chain();
    const list = db.get('list');
    return list
        .filter(val => new RegExp(`(${term.split(/\s+/i).join('|')})`, 'i').test(val.name))
        .value();
});
exports.resolvers.Query.total = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.read();
    const db = db_1.default.chain();
    const list = db.get('list');
    return list.size().value();
});
exports.resolvers.Query.update = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield folder_lister_1.updateCovers();
        return true;
    }
    catch (e) {
        return false;
    }
});
exports.resolvers.Manga.data = p => folder_lister_1.mangaData(p);
//# sourceMappingURL=resolvers.js.map
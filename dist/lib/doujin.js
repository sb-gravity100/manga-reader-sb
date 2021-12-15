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
exports.remove = exports.add = void 0;
const nhentai = __importStar(require("nhentai"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const del_1 = __importDefault(require("del"));
const database_1 = require("../database");
var api = new nhentai.API();
var doujinPath = path_1.default.join(process.cwd(), '../_dj');
function add(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var res = yield api.fetchDoujin(id);
        var promiseMap = [];
        yield database_1.db2.insert(Object.assign(Object.assign({}, res === null || res === void 0 ? void 0 : res.raw), { _id: res === null || res === void 0 ? void 0 : res.id }));
        yield fs_1.default.promises.mkdir(path_1.default.join(doujinPath, res === null || res === void 0 ? void 0 : res.id.toString()), {
            recursive: true,
        });
        res === null || res === void 0 ? void 0 : res.pages.forEach(e => {
            var filename = path_1.default.join(doujinPath, res === null || res === void 0 ? void 0 : res.id.toString(), `${e.pageNumber}.${e.extension}`);
            promiseMap.push(e.fetch().then(e => fs_1.default.promises.writeFile(filename, e)));
        });
        yield Promise.all(promiseMap);
        return true;
    });
}
exports.add = add;
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var res = yield database_1.db2.remove({
            id: Number(id),
        }, {});
        yield (0, del_1.default)(`${doujinPath}/${id}/`, {
            force: true,
        });
        return Boolean(res);
    });
}
exports.remove = remove;
//# sourceMappingURL=doujin.js.map
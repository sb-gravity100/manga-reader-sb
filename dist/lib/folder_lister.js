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
exports.updateCovers = exports.mangaData = exports.dirSync = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const nodejs_fs_utils_1 = __importDefault(require("nodejs-fs-utils"));
const url_join_1 = __importDefault(require("url-join"));
const lodash_1 = __importDefault(require("lodash"));
const jimp_1 = __importDefault(require("jimp"));
const DJ_PATH = path_1.default.normalize(path_1.default.join(__dirname, '../../DJ/'));
function dirSync() {
    const dir = fs_1.default.readdirSync(DJ_PATH, {
        withFileTypes: true,
    });
    const db = [];
    const DIRS = dir.map(folder => {
        if (folder.isDirectory()) {
            const pathname = path_1.default.join('%DJ_PATH%', folder.name);
            const realPath = pathname.replace(/%DJ_PATH%/, path_1.default.normalize(DJ_PATH));
            const createdAt = new Date(fs_1.default.statSync(realPath).birthtime);
            const size = nodejs_fs_utils_1.default.fsizeSync(realPath);
            const cover = fs_1.default.readdirSync(realPath);
            return {
                name: folder.name,
                pathname,
                createdAt,
                size: size,
                cover: url_join_1.default('cdn/manga', folder.name, 'cover.jpg'),
            };
        }
    });
    lodash_1.default.sortBy(DIRS, ['createdAt']).forEach((d, i) => db.push(Object.assign({ id: `M${i + 1}` }, d)));
    return db.map(e => (Object.assign({}, e)));
}
exports.dirSync = dirSync;
function mangaData(manga) {
    const mangaPath = manga.pathname.replace('%DJ_PATH%', path_1.default.normalize(DJ_PATH));
    const data = fs_1.default
        .readdirSync(mangaPath, {
        withFileTypes: true,
    })
        .map(file => {
        if (file.isFile()) {
            if (file.name === 'cover.jpg') {
                return null;
            }
            if (path_1.default.extname(file.name).match(/^\.(jpe?g|png|svg)$/i)) {
                return {
                    name: file.name,
                    path: url_join_1.default('cdn/manga', manga.name, file.name),
                };
            }
            return null;
        }
        return null;
    })
        .filter(lodash_1.default.isObjectLike);
    return data;
}
exports.mangaData = mangaData;
function updateCovers() {
    return __awaiter(this, void 0, void 0, function* () {
        const dirs = yield fs_1.default.promises.readdir(DJ_PATH);
        const coverdirs = [];
        for (let i = 0; i < dirs.length; i++) {
            const mangadir = dirs[i];
            const _dir = yield fs_1.default.promises.readdir(path_1.default.join(DJ_PATH, mangadir));
            const index = _dir.findIndex(e => e.match(/\.(png|jpe?g)$/i));
            if (!_dir.find(e => e === 'cover.jpg')) {
                coverdirs.push(path_1.default.join(DJ_PATH, mangadir, _dir[index]));
            }
        }
        console.log('Files Read!', coverdirs.length);
        for (var i = 0; i < coverdirs.length; i++) {
            const cover = coverdirs[i];
            const cover_file = path_1.default.join(path_1.default.dirname(cover), 'cover.jpg');
            const image = yield jimp_1.default.read(cover);
            yield image.cover(200, 270).quality(30).writeAsync(cover_file);
        }
        return;
    });
}
exports.updateCovers = updateCovers;
//# sourceMappingURL=folder_lister.js.map
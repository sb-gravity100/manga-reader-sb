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
require('dotenv').config();
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const jimp_1 = __importDefault(require("jimp"));
const faker_1 = __importDefault(require("faker"));
// import { randomBytes, randomInt } from 'crypto';
const DJ_PATH = path_1.default.normalize(path_1.default.join(process.cwd(), 'DJ/'));
function getDirSize(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = fs_1.default
            .readdirSync(filepath)
            .map((e) => fs_1.default.promises.stat(path_1.default.join(filepath, e)));
        const d = yield Promise.all(dir);
        return d.map((e_1) => e_1.size).reduce((p, n) => p + n);
    });
}
function dirSync() {
    return __awaiter(this, void 0, void 0, function* () {
        let dir = [];
        let db = [];
        if (process.env.MOCK) {
            db.push(...lodash_1.default.times(lodash_1.default.random(10, 100), (n) => {
                const name = faker_1.default.helpers.randomize([
                    faker_1.default.commerce.productName(),
                    faker_1.default.company.companyName(),
                    faker_1.default.name.findName(),
                ]);
                return {
                    name,
                    pathname: '%DJ_PATH%/' + name,
                    createdAt: faker_1.default.date.past(),
                    size: lodash_1.default.random(100000, 100000000),
                    cover: `https://picsum.photos/100/300.jpg?random=${Math.random()}`,
                    id: n++,
                };
            }));
        }
        else {
            dir = yield fs_1.default.promises.readdir(DJ_PATH, {
                withFileTypes: true,
            });
            const promiseFuncs = [];
            for (let k = dir.length - 1; k >= 0; k--) {
                const folder = dir[k];
                const func = () => Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
                    if (folder.isDirectory()) {
                        const pathname = path_1.default.join('%DJ_PATH%', folder.name);
                        const realPath = pathname.replace(/%DJ_PATH%/, path_1.default.normalize(DJ_PATH));
                        const { birthtime } = yield fs_1.default.promises.stat(realPath);
                        const size = yield getDirSize(realPath);
                        const createdAt = new Date(birthtime);
                        db.push({
                            name: folder.name,
                            pathname,
                            createdAt,
                            size,
                            cover: `/cdn/manga/${folder.name}/cover.jpg`,
                        });
                    }
                }));
                promiseFuncs.push(func());
            }
            yield Promise.all(promiseFuncs);
            db = lodash_1.default.sortBy(db, ['createdAt']).map((e, i) => {
                e.id = i + 1;
                return e;
            });
        }
        // console.log(newDB)
        return db;
    });
}
exports.dirSync = dirSync;
function mangaData(manga) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.MOCK) {
            return lodash_1.default.times(lodash_1.default.random(10, 25), (n) => ({
                name: `0${n++}.jpg`,
                path: `https://picsum.photos/500?random=${Math.random()}`,
            }));
        }
        const mangaPath = manga.pathname.replace('%DJ_PATH%', path_1.default.normalize(DJ_PATH));
        let data = yield fs_1.default.promises.readdir(mangaPath, {
            withFileTypes: true,
        });
        const final = data
            .map((file) => {
            if (file.isFile()) {
                if (file.name !== 'cover.jpg' &&
                    path_1.default.extname(file.name).match(/^\.(jpe?g|png|svg)$/i)) {
                    return {
                        name: file.name,
                        path: `/cdn/manga/${path_1.default.basename(mangaPath)}/${file.name}`,
                    };
                }
            }
        })
            .filter((v) => typeof v !== 'undefined');
        return final;
    });
}
exports.mangaData = mangaData;
function updateCovers() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.MOCK) {
            const dirs = (yield fs_1.default.promises.readdir(DJ_PATH, {
                withFileTypes: true,
            })).filter((e) => e.isDirectory());
            const coverdirs = [];
            const imagePromises = [];
            for (let i = 0; i < dirs.length; i++) {
                const mangadir = dirs[i];
                const _dir = yield fs_1.default.promises.readdir(path_1.default.join(DJ_PATH, mangadir.name));
                const index = _dir.findIndex((e) => e.match(/\.(png|jpe?g)$/i));
                if (!_dir.find((e) => e === 'cover.jpg')) {
                    coverdirs.push(path_1.default.join(DJ_PATH, mangadir.name, _dir[index]));
                }
            }
            console.log('Files Read!', coverdirs.length);
            for (var i = 0; i < coverdirs.length; i++) {
                const cover = coverdirs[i];
                const cover_file = path_1.default.join(path_1.default.dirname(cover), 'cover.jpg');
                const image = yield jimp_1.default.read(cover);
                imagePromises.push(image.cover(200, 270).quality(30).writeAsync(cover_file));
            }
            const chunks = lodash_1.default.chunk(imagePromises, 10);
            for (let i = chunks.length - 1; i >= 0; i--) {
                const chunk = chunks[i];
                yield Promise.all(chunk);
            }
        }
    });
}
exports.updateCovers = updateCovers;
//# sourceMappingURL=folder_lister.js.map
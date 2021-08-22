"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function writePromise(file, data) {
    return new Promise((resolve, reject) => fs_1.default.writeFile(file, data, 'utf8', err => err ? reject(err) : resolve()));
}
class JsonDB {
    constructor(file, initialValue, timestamp) {
        this.createdAt = undefined;
        this.updatedAt = undefined;
        this.initialValue = undefined;
        this.file = file;
        if (typeof timestamp === 'boolean') {
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
        else {
            this.createdAt = timestamp.createdAt && new Date();
            this.updatedAt = timestamp.updatedAt && new Date();
        }
        if (initialValue) {
            this.initialValue = JSON.stringify(initialValue);
        }
    }
    async read() {
        try {
            const data = await fs_1.default.promises.readFile(path_1.default.normalize(this.file), {
                encoding: 'utf8',
                flag: 'ax+',
            });
            this.data = JSON.parse(data);
        }
        catch (e) {
            if (e.message.includes('JSON')) {
                this.data = JSON.parse(this.initialValue);
            }
            await writePromise(this.file, this.initialValue);
        }
    }
    write(data) {
        const timeStamp = {};
        if (this.createdAt) {
            timeStamp.createdAt = this.createdAt;
        }
        if (this.updatedAt) {
            timeStamp.updatedAt = new Date();
        }
        lodash_1.default.merge(this.data, timeStamp, Object.assign({}, data));
        const json = JSON.stringify(this.data);
        return writePromise(this.file, json);
    }
    get(key) {
        return lodash_1.default.chain(this.data).get(key, []);
    }
    set(key, value) {
        return lodash_1.default.chain(this.data).set(key, value);
    }
}
exports.db = new JsonDB(path_1.default.join(__dirname, '../DATA.json'), {
    list: [],
}, true);
// dirSync().then(dir => {
//    db.data = {
//       list: dir
//    },
//    db.write()
// })
//# sourceMappingURL=db.js.map
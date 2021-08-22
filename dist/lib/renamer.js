"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dirs = fs_1.default.readdirSync('./');
console.log(dirs);
const renamer = async () => {
    for (let i = 0; i < dirs.length; i++) {
        const filename = dirs[i];
        if (filename.match(/\.fdm\w+$/i)) {
            const oldPath = path_1.default.join(__dirname, filename);
            const newPath = path_1.default.join('./', filename.replace(/\.fdmdownload/gi, ''));
            await fs_1.default.promises.rename(oldPath, newPath);
            console.log('Renamed %s to %s', filename, filename.replace(/\.fdmdownload/gi, ''));
        }
    }
};
renamer().catch(console.log);
//# sourceMappingURL=renamer.js.map
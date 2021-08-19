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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dirs = fs_1.default.readdirSync('./');
console.log(dirs);
const renamer = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < dirs.length; i++) {
        const filename = dirs[i];
        if (filename.match(/\.fdm\w+$/i)) {
            const oldPath = path_1.default.join(__dirname, filename);
            const newPath = path_1.default.join('./', filename.replace(/\.fdmdownload/gi, ''));
            yield fs_1.default.promises.rename(oldPath, newPath);
            console.log('Renamed %s to %s', filename, filename.replace(/\.fdmdownload/gi, ''));
        }
    }
});
renamer().catch(console.log);
//# sourceMappingURL=renamer.js.map
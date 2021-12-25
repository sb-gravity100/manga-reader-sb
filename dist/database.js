"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tags = void 0;
const nedb_promises_1 = __importDefault(require("nedb-promises"));
const db = nedb_promises_1.default.create({
    // inMemoryOnly: true,
    timestampData: true,
    filename: 'manga_data.nedb',
});
exports.tags = nedb_promises_1.default.create({
    inMemoryOnly: true,
    //  timestampData: true,
    //  filename: 'artists_data.nedb',
});
exports.default = db;
//# sourceMappingURL=database.js.map
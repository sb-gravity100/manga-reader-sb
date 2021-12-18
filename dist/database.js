"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db2 = void 0;
const nedb_promises_1 = __importDefault(require("nedb-promises"));
const db = nedb_promises_1.default.create({
    // inMemoryOnly: true,
    timestampData: true,
    filename: 'data.db',
});
exports.db2 = nedb_promises_1.default.create({
    // inMemoryOnly: true,
    timestampData: true,
    filename: 'data2.db',
});
exports.default = db;
//# sourceMappingURL=database.js.map
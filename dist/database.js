"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_promises_1 = __importDefault(require("nedb-promises"));
const db = new nedb_promises_1.default({
    inMemoryOnly: true,
    // timestampData: true,
    // filename: './data.db'
});
exports.default = db;
//# sourceMappingURL=database.js.map
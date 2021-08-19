"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const lowdb_1 = require("lowdb");
const path_1 = __importDefault(require("path"));
const adapter = new lowdb_1.JSONFile(path_1.default.join(__dirname, 'DATA.json'));
const db = new lowdb_1.Low(adapter);
db.chain = () => lodash_1.default.chain(db.data);
exports.default = db;
//# sourceMappingURL=db.js.map
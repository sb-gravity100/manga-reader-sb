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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
// import CLS from 'cls-hooked'
const sequelize_typescript_1 = require("sequelize-typescript");
const M = __importStar(require("./models"));
// const namespace = CLS.createNamespace('manga')
exports.sequelize = new sequelize_typescript_1.Sequelize('default', 'root', 'btstaehyung1', {
    dialect: 'mariadb',
    define: {
        freezeTableName: true,
        timestamps: false,
    },
    port: 3306,
    logging: false,
});
exports.sequelize.addModels(Object.values(Object.assign({}, M)));
//# sourceMappingURL=database.js.map
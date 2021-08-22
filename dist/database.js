"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import CLS from 'cls-hooked'
const sequelize_typescript_1 = require("sequelize-typescript");
// const namespace = CLS.createNamespace('manga')
function SequelizeInitialize(username, password, models) {
    const sequelize = new sequelize_typescript_1.Sequelize('default', username, password, {
        dialect: 'mariadb',
        define: {
            freezeTableName: true,
            timestamps: false
        },
        port: 3306,
        logging: false
    });
    sequelize.addModels(models);
    return sequelize;
}
exports.default = SequelizeInitialize;
//# sourceMappingURL=database.js.map
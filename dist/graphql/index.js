"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("@graphql-tools/load");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const resolvers_1 = require("./resolvers");
const path_1 = __importDefault(require("path"));
exports.default = async () => {
    const schema = await load_1.loadSchema(path_1.default.join(process.cwd(), 'graphql/schema.graphql'), {
        loaders: [new graphql_file_loader_1.GraphQLFileLoader()],
        resolvers: resolvers_1.resolvers,
    });
    return schema;
};
//# sourceMappingURL=index.js.map
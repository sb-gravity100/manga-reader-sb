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
const load_1 = require("@graphql-tools/load");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const resolvers_1 = require("./resolvers");
const path_1 = __importDefault(require("path"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const schema = yield load_1.loadSchema(path_1.default.join(__dirname, '../../graphql/schema.graphql'), {
        loaders: [new graphql_file_loader_1.GraphQLFileLoader()],
        resolvers: resolvers_1.resolvers,
    });
    return schema;
});
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const folder_lister_1 = require("../lib/folder_lister");
const lodash_1 = __importDefault(require("lodash"));
const graphql_scalars_1 = require("graphql-scalars");
const fuse_js_1 = __importDefault(require("fuse.js"));
// type AnyObject = { [key: string]: any };
exports.resolvers = {
    DateTime: graphql_scalars_1.DateTimeResolver,
    Query: {
        mangas: async (_o, args, ctx) => {
            const options = {
                limit: undefined,
                order: undefined,
                offset: 0,
            };
            if (args.refresh) {
                const data = await folder_lister_1.dirSync();
                await ctx.sequelize.sync({ force: true });
                await ctx.Models.Manga.bulkCreate(data);
            }
            if (args.sort) {
                const keys = args.sort[0].split(',');
                const order = args.sort[1].split(',');
                if (keys.length === order.length) {
                    options.order = lodash_1.default.zip(keys, order);
                }
            }
            if (args.cursor) {
                options.offset = args.cursor;
            }
            if (args.limit) {
                options.limit = args.limit;
            }
            return await ctx.Models.Manga.findAll(Object.assign({}, options));
        },
        manga: (_o, args, ctx) => ctx.Models.Manga.findByPk(args.id),
        search: async (_o, { term }, ctx) => {
            if (!term) {
                return null;
            }
            const options = {
                useExtendedSearch: true,
                threshold: 0.35,
                keys: ['name'],
                includeScore: true,
            };
            const list = await ctx.Models.Manga.findAll();
            const index = fuse_js_1.default.createIndex(options.keys, list);
            const fuse = new fuse_js_1.default(list, options, index);
            const results = fuse.search(term);
            return results.map(e => e.item);
        },
        total: (_o, _a, ctx) => ctx.Models.Manga.count(),
        update: async () => {
            try {
                await folder_lister_1.updateCovers();
                return true;
            }
            catch (e) {
                return false;
            }
        },
    },
    Manga: {
        data: (p) => folder_lister_1.mangaData(p),
    },
};
//# sourceMappingURL=resolvers.js.map
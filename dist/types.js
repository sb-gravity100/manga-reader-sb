"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortMethods = exports.SearchResult = exports.MangaTag = exports.MangaData = exports.Manga = void 0;
const nhentai_1 = require("nhentai");
class Manga extends nhentai_1.Doujin {
}
exports.Manga = Manga;
class MangaData extends nhentai_1.Image {
}
exports.MangaData = MangaData;
class MangaTag extends nhentai_1.Tag {
}
exports.MangaTag = MangaTag;
var nhentai_2 = require("nhentai");
Object.defineProperty(exports, "SearchResult", { enumerable: true, get: function () { return nhentai_2.SearchResult; } });
Object.defineProperty(exports, "SortMethods", { enumerable: true, get: function () { return nhentai_2.SortMethods; } });
//# sourceMappingURL=types.js.map
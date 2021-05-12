const path = require('path');
const fs = require('fs');
const fs2 = require('nodejs-fs-utils');
const urljoin = require('url-join');
const _ = require('lodash');
const lodashID = require('lodash-id');
_.mixin(lodashID);

const DJ_PATH = 'D:/Cafe STL/DL/Manga/DJ';

module.exports.dirSync = () => {
   const dir = fs.readdirSync(DJ_PATH, {
      withFileTypes: true,
   });
   const db = [];
   _.createId = () => {
      return 'M' + (db.length + 1);
   };

   const DIRS = dir.map(folder => {
      if (folder.isDirectory()) {
         const pathname = path.join('%DJ_PATH%', folder.name);
         const realPath = pathname.replace(
            /%DJ_PATH%/,
            path.normalize(DJ_PATH)
         );
         const createdAt = new Date(fs.statSync(realPath).birthtime);
         const size = fs2.fsizeSync(realPath);
         return ({
            name: path.basename(pathname),
            pathname,
            createdAt,
            size: size,
         });
      }
   });
   _.sortBy(DIRS, ['createdAt']).forEach(d => _.insert(db, d))
   return db;
};

module.exports.mangaData = manga => {
   const mangaPath = manga.pathname.replace(
      /%DJ_PATH%/,
      path.normalize(DJ_PATH)
   );
   const data = fs
      .readdirSync(mangaPath, {
         withFileTypes: true,
      })
      .map(file => {
         if (file.isFile()) {
            if (path.extname(file.name).match(/^\.(jpe?g|png|ico|svg)$/i)) {
               return {
                  name: file.name,
                  path: urljoin('static/manga', manga.name, file.name),
               };
            }
            return null
         }
         return null
      }).filter(_.isObjectLike);
   return data;
};

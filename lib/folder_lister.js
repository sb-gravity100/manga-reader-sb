const path = require('path');
const fs = require('fs');
const fs2 = require('nodejs-fs-utils');
const urljoin = require('url-join');
const _ = require('lodash');
const Jimp = require('jimp');

const DJ_PATH = path.normalize(path.join(__dirname, '../DJ/'));

module.exports.dirSync = () => {
   const dir = fs.readdirSync(DJ_PATH, {
      withFileTypes: true,
   });
   const db = [];

   const DIRS = dir.map(folder => {
      if (folder.isDirectory()) {
         const pathname = path.join('%DJ_PATH%', folder.name);
         const realPath = pathname.replace(
            /%DJ_PATH%/,
            path.normalize(DJ_PATH)
         );
         const createdAt = new Date(fs.statSync(realPath).birthtime);
         const size = fs2.fsizeSync(realPath);
         const cover = fs.readdirSync(realPath);
         return {
            name: folder.name,
            pathname,
            createdAt,
            size: size,
            cover: urljoin('cdn/manga', folder.name, 'cover.jpg'),
         };
      }
   });
   _.sortBy(DIRS, ['createdAt']).forEach((d, i) =>
      db.push({ id: `M${i + 1}`, ...d })
   );
   return db.map(e => ({ /* cover: urljoin('cdn/covers', e.id), */ ...e }));
};

module.exports.mangaData = manga => {
   const mangaPath = manga.pathname.replace(
      '%DJ_PATH%',
      path.normalize(DJ_PATH)
   );
   const data = fs
      .readdirSync(mangaPath, {
         withFileTypes: true,
      })
      .map(file => {
         if (file.isFile()) {
            if (file.name === 'cover.jpg') {
               return null;
            }
            if (path.extname(file.name).match(/^\.(jpe?g|png|svg)$/i)) {
               return {
                  name: file.name,
                  path: urljoin('cdn/manga', manga.name, file.name),
               };
            }
            return null;
         }
         return null;
      })
      .filter(_.isObjectLike);
   return data;
};

module.exports.updateCovers = async () => {
   const dirs = await fs.promises.readdir(DJ_PATH);
   const coverdirs = [];
   for (let i = 0; i < dirs.length; i++) {
      const mangadir = dirs[i];
      const _dir = await fs.promises.readdir(path.join(DJ_PATH, mangadir));
      const index = _dir.findIndex(e => e.match(/\.(png|jpe?g)$/i));
      if (!_dir.find(e => e === 'cover.jpg')) {
         coverdirs.push(path.join(DJ_PATH, mangadir, _dir[index]));
      }
   }
   console.log('Files Read!', coverdirs.length);
   for (var i = 0; i < coverdirs.length; i++) {
      const cover = coverdirs[i];
      const cover_file = path.join(path.dirname(cover), 'cover.jpg');
      const image = await Jimp.read(cover);
      await image.cover(200, 270).quality(30).writeAsync(cover_file);
   }
   return;
};

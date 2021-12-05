require('dotenv').config();

import path from 'path';
import fs, { Dirent } from 'fs';
import _ from 'lodash';
import Jimp from 'jimp';
import faker from 'faker';
import { Manga, MangaData } from '../types';
// import { randomBytes, randomInt } from 'crypto';

const DJ_PATH = path.normalize(path.join(process.cwd(), 'DJ/'));
const isGitpod = /gitpod/i.test(process.env.USER as string);

async function getDirSize(filepath: string) {
   const dir = fs
      .readdirSync(filepath)
      .map((e) => fs.promises.stat(path.join(filepath, e)));
   const d = await Promise.all(dir);
   return d.map((e_1) => e_1.size).reduce((p, n) => p + n);
}

export async function dirSync(): Promise<Manga[]> {
   let dir: Dirent[] = [];
   let db: Manga[] = [];
   if (isGitpod) {
      db.push(
         ..._.times<Manga>(_.random(120, 200), (n) => {
            const name = faker.helpers.randomize([
               faker.commerce.productName(),
               faker.company.companyName(),
               faker.name.findName(),
            ]);
            const id = faker.datatype.number({ min: 1001, max: 1100 });
            return {
               name,
               pathname: '%DJ_PATH%/' + name,
               createdAt: faker.date.past(),
               size: _.random(100000, 100000000),
               cover: `https://picsum.photos/id/${id}/300/300`,
               blur: `https://picsum.photos/id/${id}/300/300?blur=8`,
               id: n++,
            };
         })
      );
   } else {
      dir = await fs.promises.readdir(DJ_PATH, {
         withFileTypes: true,
      });
      const promiseFuncs: Promise<void>[] = [];

      for (let k = dir.length - 1; k >= 0; k--) {
         const folder = dir[k];
         const func = () =>
            Promise.resolve().then(async () => {
               if (folder.isDirectory()) {
                  const pathname = path.join('%DJ_PATH%', folder.name);
                  const realPath = pathname.replace(
                     /%DJ_PATH%/,
                     path.normalize(DJ_PATH)
                  );
                  const { birthtime } = await fs.promises.stat(realPath);
                  const size = await getDirSize(realPath);
                  const createdAt = new Date(birthtime);
                  db.push({
                     name: folder.name,
                     pathname,
                     createdAt,
                     size,
                     cover: `/cdn/manga/${folder.name}/cover.jpg`,
                     blur: `/cdn/manga/${folder.name}/cover_blur.jpg`,
                  });
               }
            });
         promiseFuncs.push(func());
      }
      await Promise.all(promiseFuncs);
      db = _.sortBy(db, ['createdAt']).map((e, i) => {
         e.id = i + 1;
         return e;
      });
   }
   // console.log(newDB)
   return db;
}

export async function mangaData(manga: Manga) {
   if (isGitpod) {
      return _.times(_.random(10, 25), (n) => ({
         name: `0${n++}.jpg`,
         path: `https://picsum.photos/500?random=${n}`,
      }));
   }
   const mangaPath = manga.pathname.replace(
      '%DJ_PATH%',
      path.normalize(DJ_PATH)
   );
   let data: Promise<fs.Dirent[]> | fs.Dirent[] | MangaData[] | null =
      await fs.promises.readdir(mangaPath, {
         withFileTypes: true,
      });
   const final: (MangaData | undefined)[] = data
      .map((file) => {
         if (file.isFile()) {
            if (
               file.name !== 'cover.jpg' &&
               path.extname(file.name).match(/^\.(jpe?g|png|svg)$/i)
            ) {
               return {
                  name: file.name,
                  path: `/cdn/manga/${path.basename(mangaPath)}/${file.name}`,
               };
            }
         }
      })
      .filter((v) => typeof v !== 'undefined');
   return final;
}

export async function updateCovers() {
   if (!process.env.MOCK) {
      const dirs = (
         await fs.promises.readdir(DJ_PATH, {
            withFileTypes: true,
         })
      ).filter((e) => e.isDirectory());
      const coverdirs: string[] = [];
      const imagePromises: Promise<Jimp>[] = [];
      for (let i = 0; i < dirs.length; i++) {
         const mangadir = dirs[i];
         const _dir = await fs.promises.readdir(
            path.join(DJ_PATH, mangadir.name)
         );
         const index = _dir.findIndex((e) => e.match(/\.(png|jpe?g)$/i));
         if (!_dir.find((e) => e.match(/cover|blur/i))) {
            coverdirs.push(path.join(DJ_PATH, mangadir.name, _dir[index]));
         }
      }
      console.log('Files Read!', coverdirs.length);
      for (var i = 0; i < coverdirs.length; i++) {
         const cover = coverdirs[i];
         const cover_file = path.join(path.dirname(cover), 'cover.jpg');
         const blur_file = path.join(path.dirname(cover), 'cover_blur.jpg');
         var image = await Jimp.read(cover);
         image = image.cover(300, 300).quality(30);
         imagePromises.push(
            image.writeAsync(cover_file),
            image.blur(5).writeAsync(blur_file)
         );
      }
      const chunks = _.chunk(imagePromises, 10);
      for (let i = chunks.length - 1; i >= 0; i--) {
         const chunk = chunks[i];
         await Promise.all(chunk);
      }
   }
}

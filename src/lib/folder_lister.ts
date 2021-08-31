require('dotenv').config();

import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Jimp from 'jimp';
import { Manga, MangaData } from '../types';
import { randomBytes, randomInt } from 'crypto';

const DJ_PATH = path.normalize(path.join(process.cwd(), 'DJ/'));

async function getDirSize(filepath: string) {
   const dir = fs
      .readdirSync(filepath)
      .map(e => fs.promises.stat(path.join(filepath, e)));
   const d = await Promise.all(dir);
   return d.map(e_1 => e_1.size).reduce((p, n) => p + n);
}

export async function dirSync(): Promise<Manga[]> {
   const dir = await fs.promises.readdir(DJ_PATH, {
      withFileTypes: true,
   });
   const db: Manga[] = [];
   const promiseFuncs: Promise<void>[] = [];

   for (let k = dir.length - 1; k >= 0; k--) {
      const folder = dir[k];
      if (
         process.env.NODE_ENV !== 'development' &&
         folder.name !== '_mock_data'
      ) {
         const func = async () => {
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
                  cover: `cdn/manga/${folder.name}/cover.jpg`,
               });
            }
         };
         promiseFuncs.push(func());
      }
   }
   await Promise.all(promiseFuncs);
   const newDB = _.sortBy(db, ['createdAt']).map((e, i) => {
      e.id = i + 1;
      return e;
   });
   // console.log(newDB)
   return newDB;
}

export async function mangaData(manga: Manga) {
   const mangaPath = manga.pathname.replace(
      '%DJ_PATH%',
      path.normalize(DJ_PATH)
   );
   let data: Promise<fs.Dirent[]> | fs.Dirent[] | MangaData[] | null =
      await fs.promises.readdir(mangaPath, {
         withFileTypes: true,
      });
   const final: (MangaData | undefined)[] = data
      .map(file => {
         if (file.isFile()) {
            if (
               file.name !== 'cover.jpg' &&
               path.extname(file.name).match(/^\.(jpe?g|png|svg)$/i)
            ) {
               return {
                  name: file.name,
                  path: `cdn/manga/${manga.name}/${file.name}`,
               };
            }
         }
      })
      .filter(v => typeof v !== 'undefined');
   return final;
}

export async function updateCovers() {
   const dirs = await fs.promises.readdir(DJ_PATH);
   const coverdirs: string[] = [];
   const imagePromises: Promise<Jimp>[] = [];
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
      imagePromises.push(
         image.cover(200, 270).quality(30).writeAsync(cover_file)
      );
   }
   const chunks = _.chunk(imagePromises, 10);
   for (let i = chunks.length - 1; i >= 0; i--) {
      const chunk = chunks[i];
      await Promise.all(chunk);
   }
   return;
}

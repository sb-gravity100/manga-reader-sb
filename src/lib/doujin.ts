import * as nhentai from 'nhentai';
import path from 'path';
import fs from 'fs';
import del from 'del';
import db2 from '../database';

export var api = new nhentai.API();
var doujinPath = path.join(process.cwd(), '../_dj');

export async function add(id) {
   var res = await api.fetchDoujin(id) as nhentai.Doujin;
   var promiseMap = [] as any[];
   await db2.insert({
      ...res,
      _id: res?.id,
   });
   await fs.promises.mkdir(
      path.join(doujinPath, res?.id.toString() as string),
      {
         recursive: true,
      }
   );
   var fetchCovers = async () => {
      var a = await res.thumbnail.fetch();
      var b = await res.cover.fetch();
      var filenameA = path.join(
         doujinPath,
         res.id.toString(),
         path.basename(res.thumbnail.url as string)
      );
      var filenameB = path.join(
         doujinPath,
         res.id.toString(),
         path.basename(res?.cover.url as string)
      );
      await fs.promises.writeFile(filenameA, a);
      await fs.promises.writeFile(filenameB, b);
   }
   res?.pages.forEach((e) => {
      var filename = path.join(
         doujinPath,
         res.id.toString(),
         `${e.pageNumber}.${e.extension}`
      );
      var done = async () => {
         var d = await e.fetch();
         await fs.promises.writeFile(filename, d);
      };
      promiseMap.push(done());
   });
   await fetchCovers()
   await Promise.all(promiseMap);
}

export async function remove(id) {
   var res = await db2.remove(
      {
         id: Number(id),
      },
      {}
   );
   if (fs.existsSync(`${doujinPath}/${id}/`)) {
      var paths = await del(`${doujinPath}/${id}/`, {
         force: true,
      });
      console.log('Deleted:', ...paths);
   }
   if (!res) {
      return false;
   }
   return Number(id);
}

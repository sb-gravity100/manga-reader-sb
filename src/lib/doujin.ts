import * as nhentai from 'nhentai';
import path from 'path';
import fs from 'fs';
import del from 'del';
import db2 from '../database';
import * as rax from 'retry-axios';
import axios from 'axios';

const interceptorId = rax.attach();

export var api = new nhentai.API();
var doujinPath = path.join(process.cwd(), process.env.DJ_PATH || 'gallery');

export async function write(id) {
   try {
      var res = (await api.fetchDoujin(id)) as nhentai.Doujin;
      var promiseMap = [] as any[];
      await fs.promises.mkdir(
         path.join(doujinPath, res?.id.toString() as string),
         {
            recursive: true,
         }
      );
      var fetchCovers = async () => {
         var a = await axios.get<ArrayBuffer>(res.thumbnail.url, {
            raxConfig: {
               backoffType: 'exponential',
               retry: 5,
            },
            responseType: 'arraybuffer',
         });
         var b = await axios.get<ArrayBuffer>(res.cover.url, {
            raxConfig: {
               backoffType: 'exponential',
               retry: 5,
            },
            responseType: 'arraybuffer',
         });
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
         await fs.promises.writeFile(filenameA, a.data);
         await fs.promises.writeFile(filenameB, b.data);
      };
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
      await fetchCovers();
      await Promise.all(promiseMap);
      return res;
   } catch (e) {
      console.log(e);
   }
}

export async function add(id) {
   try {
      var res = (await write(id)) as nhentai.Doujin;
      (
         res as any
      ).thumbnail.url = `/gallery/${res.id}/thumb.${res.thumbnail.extension}`;
      (
         res as any
      ).cover.url = `/gallery/${res.id}/cover.${res.cover.extension}`;
      await db2.insert({
         ...res,
         pages: res.pages.map((e: any) => {
            e.originalUrl = e.url;
            e.url = `/gallery/${res.id}/${e.pageNumber}.${e.extension}`;
            return e;
         }),
         _id: res?.id,
      });
   } catch (e) {
      await remove(id);
   }
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

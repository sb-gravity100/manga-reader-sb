import * as nhentai from 'nhentai';
import path from 'path';
import fs from 'fs';
import del from 'del';
import db2 from '../database';
import * as rax from 'retry-axios';
import axios from 'axios';
import { parse } from 'node-html-parser';

const interceptorId = rax.attach();

nhentai.Image.prototype.fetch = function () {
   return axios
      .get(this.url, {
         raxConfig: {
            backoffType: 'exponential',
            retry: 100,
         },
         responseType: 'arraybuffer',
      })
      .then((e) => e.data);
};

(nhentai.API.prototype as any).fetch = function (path) {
   return axios
      .get(nhentai.API_URL + path, {
         raxConfig: {
            backoffType: 'exponential',
            retry: 100,
         },
         responseType: 'json',
      })
      .then((e) => e.data);
};

export var api = new nhentai.API();
var doujinPath = path.join(process.cwd(), process.env.DJ_PATH || 'gallery');

export async function fetchThumbs(res: nhentai.Doujin) {
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
      await fetchThumbs(res);
      await Promise.all(promiseMap);
      return res;
   } catch (e: any) {
      console.log(e?.response?.status);
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

export async function tags() {
   var res = await axios.get('https://nhentai.net/tags/?page=1');
   var results: any[] = [];
   var doc = parse(res.data);
   var last = Number(
      new URL(
         doc.querySelector('a.last')?.getAttribute('href') as string,
         'https://nhentai.net'
      ).searchParams.get('page')
   );
   var tags = Array.from(doc.querySelectorAll('#tag-container .tag')).map(
      (e) =>
         new nhentai.Tag({
            name: e?.querySelector('.name')?.textContent.trim() as string,
            count: Number(e?.querySelector('.count')?.textContent.trim()),
            id: Number(e?.getAttribute('class')?.replace(/tag|\s+|-/gi, '')),
            type: 'artist',
            url: e?.getAttribute('href') as string,
         })
   );
   results = results.concat(tags);
   for (let i = 2; i < last - 1; i++) {
      var res = await axios.get(`https://nhentai.net/tags/?page=${i}`);
      var doc = parse(res.data);
      var tags = Array.from(doc.querySelectorAll('#tag-container .tag')).map(
         (e) =>
            new nhentai.Tag({
               name: e?.querySelector('.name')?.textContent.trim() as string,
               count: Number(
                  e
                     ?.querySelector('.count')
                     ?.textContent.trim()
                     .replace('K', '000')
               ),
               id: Number(e?.getAttribute('class')?.replace(/tag|\s+|-/gi, '')),
               type: 'tag',
               url: e?.getAttribute('href') as string,
            })
      );
      results = results.concat(tags);
   }
   return results as typeof tags;
}

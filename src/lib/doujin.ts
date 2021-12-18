import * as nhentai from 'nhentai';
import path from 'path';
import fs from 'fs';
import del from 'del'
import db2 from '../database';

var api = new nhentai.API();
var doujinPath = path.join(process.cwd(), '../_dj');

export async function add(id) {
   var res = await api.fetchDoujin(id);
   var promiseMap: Promise<any>[] = [];
   await db2.insert({
      ...res?.raw,
      _id: res?.id,
   });
   await fs.promises.mkdir(path.join(doujinPath, res?.id.toString() as string), {
      recursive: true,
   });
   res?.pages.forEach(e => {
      var filename = path.join(doujinPath, res?.id.toString() as any, `${e.pageNumber}.${e.extension}`);
      promiseMap.push(e.fetch().then(e => fs.promises.writeFile(filename, e)));
   });
   await Promise.all(promiseMap)
   return true;
}

export async function remove(id) {
   var res = await db2.remove(
      {
         id: Number(id),
      },
      {}
   );
   await del(`${doujinPath}/${id}/`, {
      force: true,
   })
   return Boolean(res);
}

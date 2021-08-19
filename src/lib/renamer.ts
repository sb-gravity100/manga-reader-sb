import fs from 'fs';
import path from 'path';

const dirs = fs.readdirSync('./');
console.log(dirs);
const renamer = async () => {
   for (let i = 0; i < dirs.length; i++) {
      const filename = dirs[i];
      if (filename.match(/\.fdm\w+$/i)) {
         const oldPath = path.join(__dirname, filename);
         const newPath = path.join(
            './',
            filename.replace(/\.fdmdownload/gi, '')
         );
         await fs.promises.rename(oldPath, newPath);
         console.log(
            'Renamed %s to %s',
            filename,
            filename.replace(/\.fdmdownload/gi, '')
         );
      }
   }
};

renamer().catch(console.log);

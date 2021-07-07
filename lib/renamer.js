const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('./')
console.log(dirs)
const renamer = async () => {
   for (let i = 0; i < dirs.length; i++) {
        const filename = dirs[i]
        if (filename.match(/\.fdm\w+$/i)) {
           const oldPath = path.join(__dirname, filename)
           const newPath = path.join('./', filename.replace(/\.fdmdownload/ig, ''))
           await fs.promises.rename(oldPath, newPath)
           console.log('Renamed %s to %s', filename, filename.replace(/\.fdmdownload/ig, ''))
        }
     }
}

renamer().catch(console.log)

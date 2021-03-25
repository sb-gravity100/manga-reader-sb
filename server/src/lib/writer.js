const fs = require('fs')
const path = require('path')
const { getImgData, dirSync } = require('./folder_lister')

const JSONList = {
   list: dirSync(),
   manga: dirSync().map(folder => {
      return getImgData(folder.id)
   }),
}

const write = () => {
   fs.writeFileSync(
      path.resolve(__dirname, '../../Data.json'),
      JSON.stringify(JSONList),
      { encoding: 'utf-8' }
   )
   return 'Written'
}

write()

module.exports = write

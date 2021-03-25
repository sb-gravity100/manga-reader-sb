const fs = require('fs')
const path = require('path')
const { getImgData, folderDir } = require('./folder_lister')

const JSONList = {
   list: folderDir,
   manga: folderDir.map(folder => {
      return getImgData(folder.id)
   }),
}

module.exports = () => {
   fs.writeFileSync(
      path.resolve(__dirname, '../../Data.json'),
      JSON.stringify(JSONList),
      { encoding: 'utf-8' }
   )
   return 'Written'
}

const path = require('path')
const fs = require('fs')
const fs2 = require('nodejs-fs-utils')
const crypto = require('crypto')
const urljoin = require('url-join')

const DJPath = 'D:/Cafe STL/DL/Manga/DJ'
const cryptHash = (hash = '') =>
  crypto.createHash('sha256').update(hash).digest('hex')

const i = 0
const dirSync = () => {
  const dir = fs.readdirSync(DJPath, {
    withFileTypes: true,
  })

  const folderDir = dir.map((folder, key) => {
    if (folder.isDirectory()) {
      key++
      const pathname = path.join(DJPath, folder.name)
      const createdAt = fs.statSync(pathname).birthtime.toISOString()
      const size = fs2.fsizeSync(pathname)
      return {
        id: `M${key}`,
        hash: cryptHash(createdAt),
        name: path.basename(pathname),
        pathname,
        createdAt,
        size: size,
      }
    }
  })
  return folderDir
}

const getImgData = id => {
  const folderDir = dirSync()
  for (let folder = 0; folder < folderDir.length; folder++) {
    if (folderDir[folder].id === id) {
      const dataFolder = folderDir[folder]
      const data = fs.readdirSync(dataFolder.pathname).map(file => ({
        name: file,
        path: urljoin('static/manga', dataFolder.name, file).toLocaleString(),
      }))
      return {
        id: dataFolder.id,
        name: dataFolder.name,
        data,
      }
    }
  }
}

module.exports = { getImgData, dirSync }

import { Router } from 'express'
import path from 'path'
import wrap from 'express-async-handler'
import FileAsync from 'lowdb/adapters/FileAsync'
import low from 'lowdb'

const adapter = new FileAsync(path.resolve(__dirname, '../../Data.json'))
const Route = Router()
   .get(
      '/list',
      wrap(async (req, res) => {
         const db = await low(adapter)
         const limit = req.query.limit
         const list = limit
            ? db.get('list').take(limit).value()
            : db.get('list').value()
         res.json(list)
      })
   )
   .get(
      '/manga/:id',
      wrap(async (req, res) => {
         const db = await low(adapter)
         const manga = db.get('manga').find({ id: req.params.id }).value()
         if (manga) {
            return res.json(manga)
         }
         throw {
            status: 404,
            message: 'Manga not found',
         }
      })
   )

export default Route

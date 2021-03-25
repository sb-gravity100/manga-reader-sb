import express from 'express'
import session from 'express-session'
import path from 'path'
import logger from 'morgan'
import createError from 'http-errors'
import cors from 'cors'
import indexRouter from './routes/index'
import { nanoid } from 'nanoid'
import write from './lib/writer'
const JsonStore = require('express-session-json')(session)

require('dotenv').config()
const { NODE_ENV } = process.env
const DJPath = path.normalize(path.join(__dirname, '../../DJ/'))
const buildPath = path.normalize(path.join(__dirname, '../../public/'))
const assetsPath = path.normalize(path.join(__dirname, '../../public/assets/'))

const readerLog =
  NODE_ENV === 'development' ? require('debug')('reader') : console.log

readerLog('Starting...')

const app = express()
const port = 7800
// eslint-disable-next-line no-underscore-dangle
const _join = (...dir) => path.join(__dirname, ...dir)
app.use(
  logger('dev', {
    stream: {
      write: msg => readerLog(msg.trimEnd()),
    },
  })
)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    genid: () => nanoid(128),
    store: new JsonStore({
      filename: 'session.json',
      path: _join('../'),
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: '/',
      sameSite: true,
      maxAge: 86400,
      secure: false,
      httpOnly: true,
    },
  })
)
app.use(express.static(buildPath))
app.use('/assets', express.static(assetsPath))
app.use('/api/static/manga', express.static(DJPath, { index: false }))
app.use('/api', indexRouter)
app.use('/api/rewrite', (_req, res) => {
  const msg = write()
  readerLog(msg)
  res.redirect('/')
})

app.get('(/*)?', async (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

app.use((_req, _res, next) => {
  next(createError(404))
})

app.use((err, _req, res, _next) => {
  const { status } = err
  res.status(status || 500).json({
    msg: err.message,
    stack: err.stack,
  })
})

app.listen(port, () => readerLog(`Server listening at ${port}`))

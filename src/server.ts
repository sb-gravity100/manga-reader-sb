require('dotenv').config();
require('express-async-errors')
import 'reflect-metadata';
import express from 'express';
import { normalize, join } from 'path';
import createError, { HttpError } from 'http-errors';
import cors from 'cors';
import logger from 'morgan';
import compression from 'compression';
import _ from 'lodash';
import { sequelize } from './database';
import * as Models from './models';
import { dirSync } from './lib/folder_lister';
import ApiRoute from './api.route'
console.log(process.cwd());

const { NODE_ENV, PORT } = process.env;
const CWD = process.cwd();
const Join = (...dir: string[]) => normalize(join(CWD, ...dir));
const DJ_PATH = Join('DJ/');
const port = PORT;
const ASSETS_PATH = Join('public/');
const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');

const boot = async () => {
   const app = express();

   const mangaData = await dirSync();
   await sequelize.sync({ force: true });
   await Models.Manga.bulkCreate(mangaData);
   debug('Database ready!');

   await new Promise<void>(res => app.listen(Number(PORT), res));

   debug(`Server listening at %s`, port);

   return app;
};

boot()
   .then(app => {
      app.use(cors());
      app.use(logger('dev'));
      app.use(
         compression({
            level: 7,
         })
      );
      app.use('/cdn/manga', express.static(DJ_PATH));
      app.use(express.static(ASSETS_PATH));

      app.get('/(*/)?', (_req, res) =>
         res.sendFile(join(ASSETS_PATH, 'index.html'))
      );
      app.get('/manga', (_req, res) =>
         res.sendFile(join(ASSETS_PATH, 'index.html'))
      );

      app.use('/api', ApiRoute)
      app.use((_req, _res, next) => next(createError(404)));
      app.use(
         (
            err: HttpError,
            _req: express.Request,
            res: express.Response,
            _next: express.NextFunction
         ) => {
            const Errors = { ...err };
            res.status(err.status || 500).json(Errors);
         }
      );
   })
   .catch(e => {
      if (_.has(e, 'sql')) {
         _.unset(e, 'sql');
         _.unset(e, 'parent');
         _.unset(e, 'stack');
         _.unset(e, 'original');
      }
      console.log(e);
      process.exit()
   });

require('dotenv').config();
require('express-async-errors');
import express from 'express';
import { normalize, join } from 'path';
import createError, { HttpError } from 'http-errors';
import cors from 'cors';
import logger from 'morgan';
import compression from 'compression';
// import _ from "lodash";
import db2 from './database';
import * as db from './database';
import * as doujin from './lib/doujin';
import ApiRoute from './api.route';
import { Debugger } from 'debug';
import mongoose from 'mongoose';
console.log(process.cwd());

var { NODE_ENV, PORT = 7800, DJ_PATH = 'gallery' } = process.env;
var CWD = process.cwd();
var Join = (...dir: string[]) => normalize(join(CWD, ...dir));
DJ_PATH = Join(DJ_PATH);
var port = PORT;
var ASSETS_PATH = Join('public/');
var debug: Debugger =
   NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');
var isGitpod = /gitpod/i.test(process.env.USER as string);

var boot = async () => {
   // console.log(isGitpod);
   var app = express();
   await db2.load();
   await db2.ensureIndex({
      fieldName: 'id',
      unique: true,
   });
   await db.tags?.load();
   await mongoose.connect('mongodb://localhost:27017/main');
   // var mangaData = await dirSync();
   // await db.insert(mangaData);
   debug('Database ready!');

   await new Promise<void>((res) => app.listen(Number(PORT), res));

   debug(`Server listening at %s`, port);

   return app;
};

boot()
   .then((app) => {
      doujin
         .tags()
         .then((e) => db.tags.insert(e))
         .catch(console.log);
      app.use(cors() as any);
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(
         logger('dev', {
            skip: (req) => {
               if (req.url.length > 50) {
                  return true;
               }
               if (req.url.match(/gallery/i)) {
                  return true;
               }
               return false;
            },
            stream: {
               write: (msg) => debug(msg.trimEnd()),
            },
         })
      );
      app.use(compression());
      app.use('/gallery', express.static(DJ_PATH));
      app.use(express.static(ASSETS_PATH));
      app.use('/api', ApiRoute);
      app.get('/*?', (_req, res) =>
         res.sendFile(join(ASSETS_PATH, 'index.html'))
      );

      app.use((_req, _res, next) => next(createError(404)));
      app.use(
         (
            err: HttpError,
            _req: express.Request,
            res: express.Response,
            _next: express.NextFunction
         ) => {
            var error = {} as typeof err;
            for (var x in err) {
               error[x] = err[x];
            }
            // console.log(err);
            res.status(err.status || 500).send(error);
         }
      );
   })
   .catch(console.log);

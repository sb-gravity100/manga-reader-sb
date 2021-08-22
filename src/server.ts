require('dotenv').config();
import 'reflect-metadata';
import express, { RequestHandler } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { normalize, join } from 'path';
import createError, { HttpError } from 'http-errors';
import cors from 'cors';
import loadSchema from './graphql';
import _ from 'lodash';
import chalk from 'chalk';
import Sequelize from './database';
import * as Models from './models';
import { dirSync } from './lib/folder_lister';
import { DatabaseError } from 'sequelize'
console.log(process.cwd());

const { NODE_ENV, PORT, DB_PASS, DB_USER } = process.env;
const CWD = process.cwd();
const Join = (...dir: string[]) => normalize(join(CWD, ...dir));
const DJ_PATH = Join('DJ/');
const port = PORT;
const ASSETS_PATH = Join('public/');
const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;

debug('Starting...');

const startApollo = async () => {
   const app = express();
   const schema = await loadSchema();

   const mangaData = await dirSync();
   const sequelize = Sequelize(DB_USER, 'btstaehyung1', Object.values({ ...Models }));
   await sequelize.sync({ force: true });
   await Models.Manga.bulkCreate(mangaData);
   debug('Database ready!')

   const apollo = new ApolloServer({
      schema,
      playground: false,
      introspection: NODE_ENV === 'development',
      tracing: true,
      context: {
         Models,
         sequelize,
      },
   });
   await apollo.start();
   apollo.applyMiddleware({ app, path: '/api/ql' });

   await new Promise<void>(res => app.listen(PORT, res));

   debug(`Apollo server ready at %s`, apollo.graphqlPath);
   debug(`Server listening at %s`, port);

   return { app, apollo };
};

function Logger(
   logger: typeof console.log | any = console.log
): RequestHandler {
   return (req, _res, next) => {
      const { method, statusCode, url } = req;
      let statusColor: string;
      if (statusCode >= 100) {
         statusColor = 'whiteBright';
      }
      if (statusCode >= 200) {
         statusColor = 'greenBright';
      }
      if (statusCode >= 300) {
         statusColor = 'cyan';
      }
      if (statusCode >= 400) {
         statusColor = 'yellow';
      }
      if (statusCode >= 500) {
         statusColor = 'redBright';
      }
      logger(`${method} ${chalk[statusColor](statusCode)} - ${url}`);
      next();
   };
}

startApollo()
   .then(({ app }) => {
      app.use(Logger(debug));
      app.use(cors());
      app.use('/cdn/manga', express.static(DJ_PATH));
      app.use(express.static(ASSETS_PATH));
      app.get('/(*/)?', (_req, res) =>
         res.sendFile(join(ASSETS_PATH, 'index.html'))
      );
      app.get('/manga', (_req, res) =>
         res.sendFile(join(ASSETS_PATH, 'index.html'))
      );

      app.use((_req, _res, next) => {
         next(createError(404));
      });

      app.use(
         (
            err: HttpError,
            _req: express.Request,
            res: express.Response,
            _next: express.NextFunction
         ) => res.status(err.status || 500).json(err)
      );
   })
   .catch(e => {
      if (_.has(e, 'sql')) {
         _.unset(e, 'sql')
         _.unset(e, 'parent')
         _.unset(e, 'stack')
         _.unset(e, 'original')
      }
      console.log(e)
   });

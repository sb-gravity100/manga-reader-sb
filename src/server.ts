require('dotenv').config();
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { normalize, join } from 'path';
import logger from 'morgan';
import createError from 'http-errors';
import cors from 'cors';
import compression from 'compression';
import loadSchema from './graphql';
import db from './db';
import _ from 'lodash';
console.log(process.cwd());
// const { mangaData } = require('./lib/folder_lister');

const { NODE_ENV, PORT } = process.env;
const DJ_PATH = normalize(join(__dirname, '../DJ/'));
const port = PORT;
const Join = (...dir: string[]) => normalize(join(__dirname, ...dir));
const ASSETS_PATH = Join('../public/');
const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
debug('Starting...');

const startApollo = async () => {
   await db.read();
   _.defaultsDeep([]);
   const app = express();
   const schema = await loadSchema();
   const apollo = new ApolloServer({
      schema,
      playground: false /* NODE_ENV === 'development' && {
         title: 'MangaQL',
         cdnUrl: '/api/_apollo',
         settings: {
            "editor.fontFamily": "'Jetbrains Mono', 'Ubuntu Mono', Consolas, monospace",
            "editor.fontSize": 12
         }
      } */,
      introspection: NODE_ENV === 'development',
      tracing: true,
   });
   await apollo.start();
   apollo.applyMiddleware({ app, path: '/api/ql' });
   await new Promise<void>(res => app.listen(PORT, res));
   debug(`Apollo server ready at %s`, apollo.graphqlPath);
   debug(`Server listening at %s`, port);

   return { app, apollo };
};

startApollo().then(({ app }) => {
   app.use(
      logger('dev', {
         stream: {
            write: msg => debug(msg.trimEnd()),
         },
      })
   );
   app.use(compression());
   app.use(cors());
   app.use('/cdn/manga', express.static(DJ_PATH));
   app.use(express.static(ASSETS_PATH));
   if (NODE_ENV == 'development') {
      app.get('/(*/)?', (_req, res) =>
         res.sendFile(ASSETS_PATH + 'index.html')
      );
      app.get('/manga', (_req, res) =>
         res.sendFile(ASSETS_PATH + 'index.html')
      );
   }

   app.use((_req, _res, next) => {
      next(createError(404));
   });

   app.use((err, _req, res, _next) => res.status(err.status || 500).json(err));
});

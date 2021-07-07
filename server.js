const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const chalk = require('chalk');
const cors = require('cors');
const { promisify } = require('util');
const compression = require('compression');
const { resolvers, typeDefs } = require('./graphql');
require('dotenv').config();

const { NODE_ENV, PORT } = process.env;
const DJ_PATH = path.normalize(path.join(__dirname, 'DJ/'));
const port = PORT;
const Join = (...dir) => path.normalize(path.join(__dirname, ...dir));
const ASSETS_PATH = Join('public/');
const debug = require('debug')('RD');
debug('Starting...');

const startApollo = async () => {
   const app = express();
   const Listen = promisify(app.listen).bind(app);
   const apollo = new ApolloServer({
      resolvers,
      typeDefs,
      playground: false /* NODE_ENV === 'development' && {
         title: 'MangaQL',
         cdnUrl: '/api/_apollo',
         settings: {
            "editor.fontFamily": "'Jetbrains Mono', 'Ubuntu Mono', Consolas, monospace",
            "editor.fontSize": 12
         }
      } */,
      introspection: NODE_ENV === 'development',
      tracing: true
   });
   await apollo.start();
   apollo.applyMiddleware({ app, path: '/api/ql' });
   await Listen({ port });
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
   if (NODE_ENV === 'development') {
      app.use('/api/_apollo', express.static(Join('_apollo/'), {
         index: true
      }))
      debug('API Playground at /api/playground');
   }
   app.use('/cdn/manga', express.static(DJ_PATH));
   app.use('/static', express.static(ASSETS_PATH + '/static'));
   app.get('(/*)?', (_req, res) => res.sendFile(ASSETS_PATH + 'index.html'));

   app.use((_req, _res, next) => {
      next(createError(404));
   });

   app.use((err, _req, res, _next) => res.status(err.status || 500).json(err));
});

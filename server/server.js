const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const chalk = require('chalk');
const cors = require('cors');
const compression = require('compression');
const { resolvers, typeDefs } = require('./graphql');
require('dotenv').config();

const { NODE_ENV, PORT, DJ_PATH } = process.env;
const port = NODE_ENV === 'development' ? 7801 : PORT;
const Join = (...dir) => path.normalize(path.join(__dirname, ...dir));
const ASSETS_PATH = Join('../public/');
const debug = NODE_ENV === 'development' ? require('debug')('RD') : console.log;
const playgroundConfig = {
   title: 'MangaQL',
   cdnUrl: '_apollo',
   settings: {
      'general.betaUpdates': true,
      'editor.fontSize': 12,
      'schema.polling.enable': true,
   },
};
debug('Starting...');

const startApollo = async () => {
   const app = express();
   const apollo = new ApolloServer({
      resolvers,
      typeDefs,
      playground: NODE_ENV === 'development' ? playgroundConfig : false,
   });
   await apollo.start();
   apollo.applyMiddleware({ app, path: '/api/ql' });
   app.use(express.json());
   app.use('(/*|/api)?/_apollo', express.static(Join('_apollo')));
   await new Promise(resolve => app.listen({ port }, resolve));
   debug(`Apollo server ready at %s`, chalk.cyan(apollo.graphqlPath));
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
   app.use('/static/manga', express.static(DJ_PATH));
   app.use(
      express.static(ASSETS_PATH, {
         index: 'index.html',
      })
   );

   // app.get('(/*)?', (_req, res) => {
   //    res.sendFile(path.join(ASSETS_PATH, 'index.html'));
   // });

   app.use((_req, _res, next) => {
      next(createError(404));
   });

   app.use((err, _req, res, _next) => {
      const { status } = err;
      res.status(status || 500).json(err);
   });
});

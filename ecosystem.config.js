module.exports = {
   apps: [
      {
         name: 'manga-reader',
         script: './dist/server.js',
         watch: ['dist/'],
         env: {
            NODE_ENV: 'production',
         },
      },
   ],
};

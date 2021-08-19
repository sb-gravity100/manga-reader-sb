module.exports = {
   apps: [
      {
         name: 'Manga Reader',
         script: '.dist/server.js',
         watch: ['dist/'],
         env: {
            NODE_ENV: 'production',
         },
      },
   ],
};

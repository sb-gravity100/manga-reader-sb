module.exports = {
  apps: [
    {
      name: 'readerapp',
      script: './dist/server.js',
      watch: false,
      env: {
        PORT: 7801,
        NODE_ENV: 'production',
      },
    },
  ],
}

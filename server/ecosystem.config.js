module.exports = {
  apps: [
    {
      name: 'readerapp',
      script: './server.js',
      watch: false,
      env: {
        PORT: 7800,
        NODE_ENV: 'production',
      },
    },
  ],
}

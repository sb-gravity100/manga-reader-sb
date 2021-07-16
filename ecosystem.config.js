module.exports = {
  apps: [
    {
      name: 'Manga Reader',
      script: './server.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}

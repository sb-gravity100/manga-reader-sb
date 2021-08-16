module.exports = {
  apps: [
    {
      name: 'Manga Reader',
      script: './server.js',
      watch: ["server.js"],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}

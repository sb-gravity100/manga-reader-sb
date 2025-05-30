const { execSync } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');

let url = 'http://localhost:7800';

if (process.env.USER?.match(/gitpod/i)) {
   url = execSync('gp url 7800').toString().trim();
}
console.log(url);

module.exports = (app) => {
   app.use(
      '/api',
      createProxyMiddleware({
         target: url,
         changeOrigin: true,
      })
   );
   app.use(
      '/gallery',
      createProxyMiddleware({
         target: url,
         changeOrigin: true,
      })
   );
};

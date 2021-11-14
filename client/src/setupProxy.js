const { execSync } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { hostname } = require('os');

let url = 'http://localhost:7800';

if (hostname().match(/(seven|seven-PC)/i)) {
   url = 'http://localhost:7800';
} else {
   url = execSync('gp url 7800').toString().trim();
}
console.log(url);
// process.exit();

module.exports = (app) => {
   app.use(
      '/api',
      createProxyMiddleware({
         target: url,
         changeOrigin: true,
      })
   );
   app.use(
      '/cdn',
      createProxyMiddleware({
         target: url,
         changeOrigin: true,
      })
   );
};

const { createProxyMiddleware } = require('http-proxy-middleware');
const { execSync } = require('child_process');

const url = execSync('gp url 7800').toString().trim();

module.exports = app => {
   app.use(
      createProxyMiddleware({
         changeOrigin: true,
         target: url,
      })
   );
};

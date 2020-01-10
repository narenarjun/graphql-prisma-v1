require('@babel/register');
require('@babel/polyfill/noConflict');
const server = require('../../src/server').default;

module.exports = async () => {
  global.testHTTPServer = await server.start({ port: 4100 }, () => {
    console.log('Test server is up on port:4100');
  });
};

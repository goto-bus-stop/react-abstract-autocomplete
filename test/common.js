require('@babel/register');
require('jsdom-global/register');

// React's internal `scheduler` package has unclosed handles
// so we have to force-exit the tests or Node.js keeps running
exports.mochaHooks = {
  afterAll() {
    setTimeout(() => {
      process.exit();
    }, 500);
  },
};

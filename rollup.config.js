import babel from 'rollup-plugin-babel';

const fs = require('fs');
const pkg = require('./package.json');

const babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));
// Don't transform modules, so rollup can read them instead.
babelrc.presets[0][1].modules = false;
// Options for rollup-plugin-babelrc.
Object.assign(babelrc, {
  babelrc: false,
  runtimeHelpers: true,
});

const externals = Object.keys(pkg.dependencies)
  .concat(Object.keys(pkg.peerDependencies));

export default {
  input: './src/index.js',
  output: [
    { format: 'cjs', file: 'index.cjs.js', exports: 'named' },
    { format: 'es', file: 'index.es.js' },
  ],
  plugins: [
    babel(babelrc),
  ],
  external: id =>
    externals.some(external => id.split('/')[0] === external),
};

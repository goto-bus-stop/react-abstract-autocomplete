import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const externals = Object.keys(pkg.dependencies)
  .concat(Object.keys(pkg.peerDependencies));

export default {
  input: './src/index.js',
  output: [
    { format: 'cjs', file: 'index.cjs.js', exports: 'named' },
    { format: 'es', file: 'index.es.js' },
  ],
  plugins: [
    babel(),
  ],
  external: id =>
    externals.some(external => id.split('/')[0] === external),
};

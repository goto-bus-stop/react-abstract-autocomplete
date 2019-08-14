import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const externals = Object.keys(pkg.dependencies)
  .concat(Object.keys(pkg.peerDependencies));

export default {
  input: './src/index.js',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      exports: 'named',
      interop: false,
      sourcemap: true,
    },
    { format: 'es', file: pkg.module, sourcemap: true },
  ],
  plugins: [
    babel(),
  ],
  external: (id) => externals.some((external) => id.split('/')[0] === external),
};

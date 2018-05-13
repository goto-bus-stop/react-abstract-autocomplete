module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: process.env.BABEL_ENV === 'testing' ? 'commonjs' : false,
      loose: true,
    }],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    ['babel-plugin-transform-react-remove-prop-types', { mode: 'wrap' }],
  ],
};

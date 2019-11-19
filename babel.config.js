module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: process.env.BABEL_ENV === 'testing' ? 'commonjs' : false,
      loose: true,
    }],
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};

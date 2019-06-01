const isModule = process.env.MODULE === 'ESM'

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { esmodules: isModule }, modules: isModule ? false : 'umd' }],
  ],
  plugins: ['babel-plugin-add-module-exports'],
}

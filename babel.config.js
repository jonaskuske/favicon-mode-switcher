const moduleType = process.env.NODE_ENV === 'test' ? 'commonjs' : process.env.MODULE

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { esmodules: moduleType === 'esm' },
        modules: moduleType === 'esm' ? false : moduleType,
      },
    ],
  ],
  plugins: moduleType === 'commonjs' ? ['add-module-exports'] : [],
}

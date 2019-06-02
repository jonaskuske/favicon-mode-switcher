/** @typedef { 'esm' | 'umd' | 'commonjs' } ModuleTypes */
/**
 * @typedef { Object } PresetEnvConfig
 * @prop { {esmodules: boolean, node?: number} } targets
 * @prop { false | ModuleTypes } modules
 */

const isTest = process.env.NODE_ENV === 'test'
const moduleType = /** @type { ModuleTypes? } */ (process.env.MODULE) || 'commonjs'

/** @type {PresetEnvConfig} */
const presetConfig = {
  targets: { esmodules: moduleType === 'esm' },
  modules: moduleType === 'esm' ? false : moduleType,
}

if (isTest) presetConfig.targets.node = 8

module.exports = {
  presets: [['@babel/preset-env', presetConfig]],
  plugins: moduleType === 'commonjs' ? ['add-module-exports'] : [],
}

import { resolve } from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'

const outputConfigs = {
  exposure: {
    file: 'dist/exposure.js',
    format: 'es',
  },
  'exposure-polyfill': {
    file: 'dist/exposure-polyfill.js',
    format: 'es',
  },
}
const plugins = [commonjs(), nodeResolve(), json()]
const packageConfig = Object.keys(outputConfigs).map((packageName) => {
  return createConfig(packageName, outputConfigs[packageName], plugins)
})

export default packageConfig

function createConfig(packageName, output, plugins = []) {
  if (!output) {
    console.log(require('chalk')).yellow(`invalid formatL: "${foramt}"`)
    process.exit(1)
  }
  const tsPlugin = ts({
    tsconfig: resolve(__dirname, 'tsconfig.json'),
  })
  return {
    input: './src/index.ts',
    output,
    plugins: [tsPlugin, createReplacePlugin(packageName), ...plugins],
  }
}

function createReplacePlugin(packageName) {
  const replacements = {
    __PLOYFILL__: false,
  }
  if (packageName === 'exposure-polyfill') {
    replacements.__PLOYFILL__ = true
  }
  return replace(replacements)
}

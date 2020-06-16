import { resolve } from 'path'
import ts from 'rollup-plugin-typescript2'
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
const packageConfig = Object.keys(outputConfigs).map((packageName) => {
  return createConfig(packageName, outputConfigs[packageName])
})

export default packageConfig

function createConfig(packageName, output) {
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
    plugins: [tsPlugin, createReplacePlugin(packageName)],
  }
}

function createReplacePlugin(packageName) {
  const replacements = {
    __POLYFILL_PLACEHOLDER__: '',
  }
  if (packageName === 'exposure-polyfill') {
    replacements.__POLYFILL_PLACEHOLDER__ = 'import "./polyfill.js"'
  }
  return replace(replacements)
}

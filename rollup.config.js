import { resolve } from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'

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
  return createConfig(outputConfigs[packageName])
})

export default packageConfig

function createConfig(output, plugins = []) {
  if (!output) {
    console.log(require('chalk')).yellow(`invalid formatL: "${foramt}"`)
    process.exit(1)
  }
  const tsPlugin = ts({
    tsconfig: resolve(__dirname, 'tsconfig.json'),
  })
  return {
    input: 'src/index.ts',
    output,
    plugins: [tsPlugin, json(), ...plugins],
  }
}

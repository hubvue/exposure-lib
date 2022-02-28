const fs = require('fs').promises
const inquirer = require('inquirer')
const typescript = require('rollup-plugin-typescript2')
const chalk = require('chalk')
const rollup = require('rollup')
const { resolve } = require('path')

const args = require('minimist')(process.argv.slice(2))

const getPackagesName = async () => {
  const allPackagesName = await fs.readdir(resolve(__dirname, '../packages'))
  return allPackagesName
    .filter((packageName) => {
      const isHiddenFile = /^\./g.test(packageName)
      return !isHiddenFile
    })
    .filter((packageName) => {
      const isPrivatePackage = require(resolve(
        __dirname,
        `../packages/${packageName}/package.json`
      )).private
      return !isPrivatePackage
    })
}

const getAnswersFromInquirer = async (packagesName) => {
  const choicePackageQuestion = {
    type: 'checkbox',
    name: 'packages',
    scroll: false,
    message: 'Select build repo(Support Multiple selection)',
    choices: packagesName.map((packageName) => ({
      value: packageName,
      packageName,
    })),
  }
  let { packages } = await inquirer.prompt(choicePackageQuestion)
  if (!packages.length) {
    console.log(
      chalk.yellow(`
        It seems that you did't make a choice.
  
        Please try it again.
      `)
    )
    return
  }
  if (packages.some((package) => package === 'all')) {
    packagesName.shift()
    packages = packagesName
  }
  const confirmPackageQuestion = {
    name: 'confirm',
    message: `Confirm build ${packages.join(' and ')} packages?`,
    type: 'list',
    choices: ['Y', 'N'],
  }
  const { confirm } = await inquirer.prompt(confirmPackageQuestion)
  if (confirm === 'N') {
    console.log(chalk.yellow('[release] cancelled.'))
    return
  }
  return packages
}

const cleanPackagesOldDist = async (packagesName) => {
  for (let packageName of packagesName) {
    const distPath = resolve(__dirname, `../packages/${packageName}/dist`)
    try {
      const stat = await fs.stat(distPath)
      if (stat.isDirectory()) {
        await fs.rm(distPath, {
          recursive: true,
        })
      }
    } catch (err) {
      console.log('err', err)
      console.log(chalk.red(`remove ${packageName} dist dir error!`))
    }
  }
}

const cleanPackagesDtsDir = async (packageName) => {
  const dtsPath = resolve(__dirname, `../packages/${packageName}/dist/packages`)
  console.log('dtsPath', dtsPath)
  try {
    const stat = await fs.stat(dtsPath)
    if (stat.isDirectory()) {
      await fs.rm(dtsPath, {
        recursive: true,
      })
    }
  } catch (err) {
    console.log(err)
    console.log(chalk.red(`remove ${packageName} dist/packages dir error!`))
  }
}

const pascalCase = (str) => {
  const re = /-(\w)/g
  const newStr = str.replace(re, function (match, group1) {
    return group1.toUpperCase()
  })
  return newStr.charAt(0).toUpperCase() + newStr.slice(1)
}

const formats = ['esm', 'cjs']
const packageOtherConfig = {
  vue2: {
    external: ['@exposure-lib/core'],
  },
  vue: {
    external: ['@exposure-lib/core'],
  },
}
const generateBuildConfigs = (packagesName) => {
  const packagesFormatConfig = packagesName.map((packageName) => {
    const formatConfigs = []
    for (let format of formats) {
      formatConfigs.push({
        packageName,
        config: {
          input: resolve(__dirname, `../packages/${packageName}/src/index.ts`),
          output: {
            name: pascalCase(packageName),
            file: resolve(
              __dirname,
              `../packages/${packageName}/dist/index.${format}.js`
            ),
            format,
          },
          plugins: [
            typescript({
              verbosity: -1,
              tsconfig: resolve(__dirname, '../tsconfig.json'),
              tsconfigOverride: {
                include: [`package/${packageName}/src`],
              },
            }),
          ],
          ...packageOtherConfig[packageName],
        },
      })
    }
    return formatConfigs
  })
  return packagesFormatConfig.flat()
}

const extractDts = (packageName) => {
  const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')
  const extractorConfigPath = resolve(
    __dirname,
    `../packages/${packageName}/api-extractor.json`
  )
  const extractorConfig =
    ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
  const result = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  })
  return result
}

const buildEntry = async (packageConfig) => {
  try {
    const packageBundle = await rollup.rollup(packageConfig.config)
    await packageBundle.write(packageConfig.config.output)
    const extractResult = extractDts(packageConfig.packageName)
    await cleanPackagesDtsDir(packageConfig.packageName)
    if (!extractResult.succeeded) {
      console.log(chalk.red(`${packageConfig.packageName} d.ts extract fail!`))
    }
    console.log(chalk.green(`${packageConfig.packageName} build successful! `))
  } catch (err) {
    console.log(chalk.red(`${packageConfig.packageName} build fail!`))
  }
}

const build = async (packagesConfig) => {
  for (let config of packagesConfig) {
    await buildEntry(config)
  }
}

const buildBootstrap = async () => {
  const packagesName = await getPackagesName()
  let buildPackagesName = packagesName
  if (!args.all) {
    packagesName.unshift('all')
    const answers = await getAnswersFromInquirer(packagesName)
    if (!answers) {
      return
    }
    buildPackagesName = answers
  }
  await cleanPackagesOldDist(buildPackagesName)
  const packagesBuildConfig = generateBuildConfigs(buildPackagesName)
  await build(packagesBuildConfig)
}

buildBootstrap().catch((err) => {
  console.log('err', err)
  process.exit(1)
})

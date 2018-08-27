---
layout: false
rename:
  basename: './src/lib/core/SWAPConfig.js'
---
import debug from 'debug'
import assert from 'assert'
import chalk from 'chalk'

const dbug = debug('swap:core:SWAPConfig')
dbug('loading module')

export class SWAPConfig {
  constructor (swapApp) {
    dbug('creating SWAPConfig instance')
    this.base = swapApp

    const validatedEnv = this.validateEnv()
    Object.getOwnPropertyNames(validatedEnv).forEach(name => {
      let value = validatedEnv[name]
      Object.defineProperty(this, name, {
        value,
        writable: false,
        enumerable: true
      })
      dbug(`> swapApp config: '${chalk.blue(name)}' is set to '${chalk.blue(value)}'`)
    })
  }

  validateEnv () {
    let errMsg

    const env = process.env.NODE_ENV
    const acceptedEnvs = ['development', 'production', 'test'].concat(['dev', 'prod', 'tests'])
    errMsg = chalk.red(`process.env.NODE_ENV must be defined in (dev, prod, test, development, production, tests) as the runtime environment, but got ${env}`)
    assert.ok(env !== undefined && acceptedEnvs.includes(env), errMsg)

    const port = process.env.PORT
    errMsg = chalk.red(`process.env.PORT must be defined as a port number for the HTTP server to listen on, but got ${port}`)
    assert.ok(port !== undefined && !isNaN(port), errMsg)

    let enableLogging = process.env.ENABLE_LOGGING
    errMsg = chalk.red(`process.env.ENABLE_LOGGING must be defined and set as "true" or "false", but got ${enableLogging}`)
    assert.ok(enableLogging !== undefined && ['true', 'false'].includes(enableLogging), errMsg)
    enableLogging = (enableLogging === 'true')

    let debugMode = process.env.DEBUG
    if (debugMode === undefined) {
      console.log(chalk.blue(`process.env.DEBUG should be defined explicitly, but got ${debugMode}`))
    }

    let dbUsername = process.env.DB_USERNAME
    errMsg = chalk.red(`process.env.DB_USERNAME must be defined, but got ${dbUsername}`)
    assert.ok(dbUsername !== undefined, errMsg)

    let dbPassword = process.env.DB_PASSWORD
    errMsg = chalk.red(`process.env.DB_PASSWORD must be defined, but got ${dbPassword}`)
    assert.ok(dbPassword !== undefined, errMsg)

    let dbHost = process.env.DB_HOST
    errMsg = chalk.red(`process.env.DB_HOST must be defined, but got ${dbHost}`)
    assert.ok(dbHost !== undefined, errMsg)

    let dbPort = process.env.DB_PORT
    errMsg = chalk.red(`process.env.DB_PORT must be defined, but got ${dbPort}`)
    assert.ok(dbPort !== undefined, errMsg)

    let dbName = process.env.DB_NAME
    errMsg = chalk.red(`process.env.DB_NAME must be defined, but got ${dbName}`)
    assert.ok(dbName !== undefined, errMsg)

    return { env, port, enableLogging, debugMode, dbUsername, dbPassword, dbHost, dbPort, dbName }
  }
}

dbug('module loaded')

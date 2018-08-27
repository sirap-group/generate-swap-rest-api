---
layout: false
rename:
  basename: './src/lib/core/SWAPApp.js'
---
import assert from 'assert'
import debug from 'debug'
import Base from 'base'
import baseLogger from 'base-logger'
import baseOptions from 'base-option'
import chalk from 'chalk'

import {SWAPConfig} from './SWAPConfig'
import {SWAPKoa} from './swapKoa/SWAPKoa'
import {Status} from './Status'

const dbug = debug('swap:core:SWAPApp')
dbug(`loading module`)

const baseConfig = { isApp: true }

export class SWAPApp extends Base {
  constructor (config, options) {
    dbug('creating SWAPApp instance')

    super(baseConfig)
    this.is('SWAPApp')
    this.set('config', new SWAPConfig(this))
    this.set('status', Status.DISABLED)

    this.use(baseOptions())
    this.option('logger', true)
    this.use(baseLogger({ defaultListener: true }))
  }

  initServer () {
    dbug('initializing swap server')

    const koaApp = new SWAPKoa(this)
    this.set('koaApp', koaApp)
    koaApp.preRoutingConfig()
    koaApp.routingConfig()
    koaApp.postRoutingConfig()

    this.set('status', 'stop/waiting')
    // dbug('all configured middlewares are stored in this list', this.get('koaApp').middleware)
  }

  /**
   * Make the server start listening
   * @returns {SWAPKoa} the SWAPKoa instance for chaining
   */
  start () {
    dbug('starting http server')
    const env = this.get('config.env')
    const port = this.get('config.port')
    const server = this.get('server')

    server.listen(port)
    this.set('status', 'start/running')

    this.log('\n---')
    this.log(chalk.yellow('⚡⚡⚡') + chalk.green(` 🙂 Your SWAPApp REST API server is running ! `) + chalk.yellow('⚡⚡⚡'))
    this.log(`✔ listening port: ${chalk.blue(port)}`)
    this.log(`✔ environment: ${chalk.blue(env)}`)
    this.log('---')
    return this
  }

  stop () {
    dbug('closing server')
    const server = this.get('server')
    assert(undefined !== server, 'The server must be started to be stoppable.')
    server.close()

    dbug('destroying server')
    server.destroy()

    this.set('status', 'stop/waiting')
  }

  static formatError (err) {
    return {
      // the original error
      status: err.status,
      message: err.message,

      // custom props
      // expose: true,
      success: false,
      reason: 'Unexpected'
    }
  }
}

dbug(`module loaded`)

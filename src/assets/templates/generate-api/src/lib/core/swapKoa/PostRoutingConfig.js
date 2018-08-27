---
layout: false
rename:
  basename: './src/lib/core/swapKoa/PostRoutingConfig.js'
---
import debug from 'debug'

const dbug = debug('swap:core:swapKoa:PostRoutingConfig')
dbug('loading module')

export class PostRoutingConfig {
  /**
   * @param {SWAPKoa} app The SWAPKoa instance
   */
  constructor (app) {
    dbug('creating PostRoutingConfig instance')
    this.app = app
    this.base = app.base
  }

  configureMiddlewares () {
    this.app.use(this.base.router.routes())
    return this
  }
}

dbug('module loaded')

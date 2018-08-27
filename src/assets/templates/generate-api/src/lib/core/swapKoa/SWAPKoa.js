---
layout: false
rename:
  basename: './src/lib/core/swapKoa/SWAPKoa.js'
---
import debug from 'debug'
import Koa from 'koa'

import {PreRoutingConfig} from './PreRoutingConfig'
import {RoutingConfig} from './RoutingConfig'
import {PostRoutingConfig} from './PostRoutingConfig'

const dbug = debug('swap:core:swapKoa:SWAPKoa')
dbug('loading module')

export class SWAPKoa extends Koa {
  constructor (swapApp) {
    dbug('Creating instance...')
    super({
      proxy: true
    })

    this.base = swapApp
    this.context.base = this.base

    dbug('Creating instance... OK.')
  }

  preRoutingConfig () {
    new PreRoutingConfig(this)
      .handleErrors()
      .handleResponseLength()
      .configureMiddlewares()
      .logRequestHandling()
      .initDatabase()
      .createServer()
  }

  routingConfig () {
    new RoutingConfig(this)
      .configureMiddlewares()
  }

  postRoutingConfig () {
    new PostRoutingConfig(this)
      .configureMiddlewares()
  }
}

dbug('module loaded')

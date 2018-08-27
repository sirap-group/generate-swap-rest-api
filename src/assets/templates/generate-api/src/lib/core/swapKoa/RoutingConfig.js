---
layout: false
rename:
  basename: './src/lib/core/swapKoa/RoutingConfig.js'
---
import debug from 'debug'
import Router from 'koa-router'
import { sleep } from 'sleep'

import { postLogin } from '../../app/apis/v1/auth/login/post'
import { postUser } from '../../app/apis/v1/users/post'

const dbug = debug('swap:core:swapKoa:RoutingConfig')
dbug('loading module')

export class RoutingConfig {
  /**
   * @param {SWAPKoa} app The SWAPKoa instance
   */
  constructor (app) {
    dbug('creating RoutingConfig instance')
    this.app = app
    this.base = app.base
    this.base.router = new Router()
  }

  configureMiddlewares () {
    dbug('setting up route /test/hello')
    this.base.router.get('/test/hello', this.helloWorldMiddleware)

    dbug('setting up route /test/sleep')
    this.base.router.get('/test/sleep', this.helloSleepMiddleware)

    dbug('setting up route /test/error')
    this.base.router.get('/test/error', this.helloErrorMiddleware)

    dbug('setting up route `POST /api/v1/auth/login`')
    this.base.router.post('/api/v1/auth/login', postLogin)

    dbug('setting up route `POST /api/v1/users`')
    this.base.router.post('/api/v1/users', postUser)

    return this
  }

  async helloWorldMiddleware (ctx) {
    ctx.body = 'HELLO SWAP APP'
  }

  async helloSleepMiddleware (ctx) {
    ctx.body = 'HELLO SLEEP'
    sleep(5)
  }

  async helloErrorMiddleware (ctx) {
    // ctx.throw(404, 'Hello, but Not found')
    // ctx.throw(500, 'Hello error !')
    ctx.throw('Hello error !')
  }
}

dbug('module loaded')

---
layout: false
rename:
  basename: './src/lib/core/swapKoa/PreRoutingConfig.js'
---
import debug from 'debug'
import chalk from 'chalk'
import http from 'http'
import destroyable from 'server-destroy'
import bodyParser from 'koa-bodyparser'
import jsonFilter from '@koa/json-filter'
import compress from 'koa-compress'
import prettyResponse from 'koa-json'
import jsonError from 'koa-json-error'
import httpLogger from 'koa-bunyan-logger'
import responseLength from 'koa-response-length'
import mongoose from 'mongoose'
// import mongoose from 'koa-mongoose'
import session from 'koa-session'
import passport from 'koa-passport'
import MongooseStore from 'koa-session-mongoose'

import { SWAPApp } from '../SWAPApp'
import { RequestLogger } from '../utils/RequestLogger'

const dbug = debug('swap:core:swapKoa:PreRoutingConfig')
dbug('loading module')

export class PreRoutingConfig {
  /**
   * @param {SWAPKoa} app The SWAPKoa instance
   */
  constructor (app) {
    dbug('creating PreRoutingConfig instance')
    this.app = app
    this.base = app.base
  }

  createServer () {
    dbug('create http server')
    this.base.set('server', http.createServer(this.app.callback()))
    destroyable(this.base.get('server'))
    return this
  }

  initDatabase () {
    dbug('initialize database')
    // this.base.use(mongoose({
    //   username: this.base.get('config.dbUsername'),
    //   password: this.base.get('config.dbPassword'),
    //   host: this.base.get('config.dbHost'),
    //   port: this.base.get('config.dbPort'),
    //   database: this.base.get('config.dbName'),
    //   // schemas: './schemas',
    //   mongodbOptions: {
    //     poolSize: 5,
    //     native_parser: true
    //   }
    // }))
    this.base.set('db', mongoose.connect('mongodb://tereo-mongo/tereo-dev', err => {
      if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'))
        console.log(chalk.red(err))
      }
    }))

    return this
  }

  logRequestHandling () {
    this.app.use(RequestLogger.middleware)
    return this
  }

  handleErrors () {
    this.app.on('error', async (err, ctx) => {
      this.base.error(err.stack || err)
      this.base.info('TODO: send error log to central server, passing err and ctx objects as JSON data')
    })
    return this
  }

  handleResponseLength () {
    // see https://github.com/segmentio/koa-response-length/issues/1
    // this.app.on('response', (len, ctx) => {
    //   this.base.error('url: %s length: %s', ctx.url, len)
    // })
    return this
  }

  configureMiddlewares () {
    return this
      .configureRequests()
      .configureResponses()
      .configurePassportSessions()
  }

  configureRequests () {
    this.app
      .use(bodyParser()) // @see https://github.com/koajs/bodyparser#options
      .use(jsonFilter()) // @see https://github.com/koajs/json-filter

    return this
  }

  configureResponses () {
    this.app
      .use(compress({ // @see https://github.com/koajs/compress
        filter: function (contentType) {
          return /text/i.test(contentType)
        },
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
      }))
      .use(responseLength())
      .use(httpLogger())
      .use(prettyResponse()) // @see https://github.com/koajs/json
      .use(jsonError(SWAPApp.formatError)) // @see https://github.com/koajs/json-error

    return this
  }

  configurePassportSessions () {
    if (this.base.get('config.env') !== 'test') {
      this.app.keys = ['secret']
      this.app
        .use(session({ // @see https://github.com/koajs/session
          store: new MongooseStore() // @see https://github.com/mjbondra/koa-session-mongoose
        }, this.app))
        .use(passport.initialize()) // @see https://github.com/rkusa/koa-passport
        .use(passport.session())
    }

    return this
  }
}

dbug('module loaded')

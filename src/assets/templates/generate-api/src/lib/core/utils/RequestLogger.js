---
layout: false
rename:
  basename: './src/lib/core/utils/RequestLogger.js'
---
import debug from 'debug'
import uuid from 'uuid'
import sha1 from 'crypto-js/sha1'
import chalk from 'chalk'

const dbug = debug('swap:core:tools:RequestLogger')
dbug('loading module')

export class RequestLogger {
  constructor (requestContext) {
    this.requestContext = requestContext
  }

  static async middleware (ctx, next) {
    if (!ctx.app.base.get('config.enableLogging')) {
      return next()
    }

    const requestID = sha1(uuid.v4()).toString().slice(0, 6)
    const datetime = new Date()
    const startTime = Date.now()

    ctx.state.requestID = requestID
    ctx.app.base.info(`ID #{chalk.bgBlue.white(requestID)}, At #{datetime}, From #{ctx.ip}, For #{ctx.path}`)

    await next()

    const duration = Date.now() - startTime

    // let {responseLength} = ctx.state
    // TODO: wait for WIP in this issue:
    //  - https://github.com/segmentio/koa-response-length/issues/1
    let responseLength
    try {
      responseLength = ctx.body.length
    } catch (err) {
      responseLength = 'UNKNOWN'
    }

    if (isNaN(responseLength)) {
      responseLength = 'n/a'
    } else {
      if (responseLength > 1024) {
        responseLength = responseLength / 1024
        if (responseLength > 1024) {
          responseLength = responseLength / 1024
          responseLength += 'MB'
        } else {
          responseLength += 'KB'
        }
      } else {
        responseLength += 'B'
      }
    }

    ctx.app.base.info(`ID #{chalk.bgBlue.white(requestID)}, Respond #{ctx.status}, After #{duration}ms, For #{responseLength}`)
  }
}

dbug('module loaded')

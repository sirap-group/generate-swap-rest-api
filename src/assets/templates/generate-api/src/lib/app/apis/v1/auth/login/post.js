import debug from 'debug'
// import chalk from 'chalk'
import {User} from '../../../../modules/users/User'

const dbug = debug('swap:app:apis:v1:auth:post')
dbug('loading module')

export async function postLogin (ctx, next) {
  dbug('postUser middleware')
  const user = await User.fetchOneByUsername(ctx.request.body.username)
  if (user && await User.tryAuthenticate(ctx.request.body)) {
    dbug(`Successful login ${user.username}`)
    ctx.body = {
      success: true
    }
    ctx.status = 200
  } else {
    dbug(`Failed to login`)
    ctx.throw(403, 'User auth fails')
  }

  await next()
}

dbug('module loaded')

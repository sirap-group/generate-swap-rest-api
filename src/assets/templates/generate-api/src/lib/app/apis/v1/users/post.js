import debug from 'debug'
import chalk from 'chalk'
import {User} from '../../../modules/users/User'

const dbug = debug('swap:app:apis:v1:users:post')
dbug('loading module')

export async function postUser (ctx, next) {
  dbug('postUser middleware')
  await User.createUser(ctx.request.body)
    .then(u => {
      dbug('SAVED USER', u)
      ctx.body = u
      ctx.status = 201

      return next()
    })
    .catch(err => {
      console.error(chalk.red(err))
      ctx.status = 400
      // ctx.err = err
      ctx.throw(err)
      return next()
    })
}

dbug('module loaded')

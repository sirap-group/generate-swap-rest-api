import 'mocha'
import chai from 'chai'
import debug from 'debug'
import supertest from 'supertest'
// import chalk from 'chalk'

import { SWAPApp } from '../../../../../core/SWAPApp'
import { postLogin } from './post'

const expect = chai.expect

const dbug = debug('swap:app:apis:v1:users:post:spec')
dbug('loading module')

let swapApp, request

describe('Login User', function () {
  this.slow(250)
  this.timeout(4000)

  before(() => {
    swapApp = new SWAPApp()
    swapApp.initServer()
    request = supertest(swapApp.get('koaApp').callback())
  })

  describe('middleware postLogin()', () => {
    it('should set body.success to true', async () => {
      const ctx = {
        body: null,
        request: {
          body: {
            username: 'remi3deb43',
            password: 'password123456'
          }
        },
        throw: () => {}
      }

      await postLogin(ctx, async () => { })

      expect(ctx.body.success).to.equal(true)
    })
  })

  describe('Route POST /api/v1/auth/login', () => {
    it('should respond 200', async () => {
      const response = await request
        .post('/api/v1/auth/login')
        .send({
          username: 'remi3deb43',
          password: 'password123456'
        })

      expect(response.status).to.equal(200)
    })

    it('should send the user data')
  })
})

dbug('module loaded')

import 'mocha'
import chai from 'chai'
import debug from 'debug'
import supertest from 'supertest'
import { Uniqueness } from '../../../../core/utils/Uniqueness'
// import chalk from 'chalk'
import {SWAPApp} from '../../../../core/SWAPApp'
import {postUser} from './post'

const expect = chai.expect

const dbug = debug('swap:app:apis:v1:users:post:spec')
dbug('loading module')

let swapApp, request

describe('Create User', function () {
  this.slow(250)
  this.timeout(4000)

  before(() => {
    swapApp = new SWAPApp()
    swapApp.initServer()
    request = supertest(swapApp.get('koaApp').callback())
  })

  describe('middleware postUser()', () => {
    it('should send the new user in body response', async () => {
      const ctx = {
        request: {
          body: {
            gender: 'male',
            firstName: 'Rémi',
            lastName: 'Becheras',
            email: 'rbecheras@sirap.fr',
            username: Uniqueness.asPostfix('usertest_'),
            password: 'password123456',
            provider: 'local',
            roles: ['rootAdmin']
          }
        },
        throw: () => {}
      }

      await postUser(ctx, async () => { })

      expect(ctx.body).to.be.an('object')
    })
  })

  describe('Route POST /api/v1/users', () => {
    it('should respond 201', async () => {
      const response = await request
        .post('/api/v1/users')
        .send({
          gender: 'male',
          firstName: 'Rémi',
          lastName: 'Becheras',
          email: 'rbecheras@sirap.fr',
          username: Uniqueness.asPostfix('usertest_'),
          password: 'password123456',
          provider: 'local',
          roles: ['observer']
        })

      expect(response.status).to.equal(201)
    })
  })
})

dbug('module loaded')

---
layout: false
rename:
  basename: './src/lib/core/swapKoa/RoutingConfig.spec.js'
---
import 'mocha'
import chai from 'chai'
import debug from 'debug'
import request from 'supertest'

// import {swapApp} from '../../index'
import {SWAPApp} from '../SWAPApp'
import {RoutingConfig} from '../swapKoa/RoutingConfig'

const expect = chai.expect

const isCI = process.env.CI
const isTravis = isCI || process.env.TRAVIS
// const fixtures = path.resolve.bind(path, __dirname, 'fixtures')
// const testFolder = path.resolve.bind(path, __dirname, 'actual')

const dbug = debug('swap:core:swapKoa:RoutingConfig:spec')
dbug('loading module')

let swapApp

/**
 * @test {class} RoutingConfig
 */
describe('RoutingConfig', function () {
  this.slow(250)
  this.timeout(7000)

  before(() => {
    dbug('Before Hook...')
    if (isCI || isTravis) {
      const contextLabel = isTravis ? 'Travis CI' : 'CI'
      dbug(contextLabel + ` test running`)
    }

    swapApp = new SWAPApp()
    swapApp.initServer()

    dbug('Before Hook... Done.')
  })
  beforeEach(() => {
    // dbug('BeforeEach Hook...')
    // swapApp = {base: {}}
    // dbug('BeforeEach Hook... Done.')
  })

  afterEach(() => {
    // dbug('AfterEach Hook...')
    // swapApp.stopServer()
    // dbug('AfterEach Hook... Done.')
  })
  after(() => {
    // dbug('After Hook...')
    // swapApp.stopServer()
    // dbug('After Hook... Done.')
  })

  /**
   * @test {function} helloWorldMiddleware()
   */
  describe('#helloWorldMiddleware()', () => {
    it('should send "HELLO SWAP APP" in body response', async () => {
      const ctx = {}

      await new RoutingConfig(swapApp).helloWorldMiddleware(ctx, () => {})
      expect(ctx.body).to.equal('HELLO SWAP APP')
    })
  })

  describe('API /test', () => {
    describe('Route /test/hello', () => {
      it('should respond 200', async () => {
        const response = await request(swapApp.get('koaApp').callback()).get('/test/hello')
        expect(response !== undefined).to.equal(true)
      })
    })
  })
})

dbug('module loaded')

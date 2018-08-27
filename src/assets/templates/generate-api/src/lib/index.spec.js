---
layout: false
rename:
  basename: './src/lib/index.spec.js'
---
import Base from 'base'
import 'mocha'
// import path from 'path'
import chai from 'chai'
import debug from 'debug'

// import SWAPApp from '../lib/core/SWAPApp'
import {swapApp} from './index'

const expect = chai.expect

const isCI = process.env.CI
const isTravis = isCI || process.env.TRAVIS
// const fixtures = path.resolve.bind(path, __dirname, 'fixtures')
// const testFolder = path.resolve.bind(path, __dirname, 'actual')

const dbug = debug('swap:index:spec')
dbug('loading module')

/**
 * @test The exported value of index module
 */
describe('The exported value of index module', function () {
  this.slow(250)

  if (isCI || isTravis) {
    before(done => {
      const contextLabel = isTravis ? 'travis' : 'CI'
      dbug(contextLabel + `test running`)
      done()
    })
  }

  after(() => {
    // done()
    dbug('after Hook: stop server')
    swapApp.stop()
  })

  it('should export an object', () => {
    expect(swapApp).to.be.an('object')
  })

  it('should export an instance of Base', () => {
    expect(swapApp).to.be.an.instanceOf(Base)
  })
})

dbug('module loaded')

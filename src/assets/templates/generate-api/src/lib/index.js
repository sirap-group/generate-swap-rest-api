---
layout: false
rename:
  basename: './src/lib/index.js'
---
import {SWAPApp} from './core/SWAPApp'
import debug from 'debug'

const dbug = debug('swap:index')
dbug('loading module')

const swapApp = new SWAPApp()

swapApp.initServer()
swapApp.start()

export default swapApp
export {swapApp}

dbug('module loaded')

---
layout: false
rename:
  basename: './src/lib/core/Status.js'
---
import debug from 'debug'
import { Enum } from 'enumify'

const dbug = debug('swap:core:swapApp:Status')
dbug('loading module')

export class Status extends Enum {}

dbug('initializing SWAPApp status enums')
Status.initEnum(['DISABLED', 'STOP/WAITING', 'START/RUNNING'])
dbug('status enums created:', Status.enumValues)

dbug('module loaded')

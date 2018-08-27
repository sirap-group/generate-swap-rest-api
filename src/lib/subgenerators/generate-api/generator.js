import isValid from 'is-valid-app'
import helperDate from 'helper-date'

import { task } from '../../utils/utils'
import { escapeQuotes } from '../../utils/helpers'

import generateDefaults from 'generate-defaults'

export default function (app) {
  if (!isValid(app, 'generate-api')) return

  app.on('error', err => app.log.error(err))

  app.helper('date', helperDate)
  app.helper('escapeQuotes', escapeQuotes)

  app.use(generateDefaults)

  /**
   * Write all api project directory tree and files
   *
   * ```sh
   * $ gen api
   * ```
   * @name file
   * @api public
   */
  // task(app, 'api', 'generate-api/**/*.*')
  task(app, 'api', 'generate-api/swapd')

  /**
   * Run the `example-subgenerator` task
   *
   * ```sh
   * $ gen example-subgenerator
   * ```
   *
   * or
   *
   * ```sh
   * $ gen example-subgenerator:default
   * ```
   *
   * @name file
   * @api public
   */
  app.task('default', ['api'])
}

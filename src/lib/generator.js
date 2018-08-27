import isValid from 'is-valid-app'
import path from 'path'
import { task } from './utils/utils'

import generateDefaults from 'generate-defaults'
import generateDest from 'generate-dest'
import generateGit from 'generate-git'
import generateSwapProject from 'generate-swap-project'

import generateSubgeneratorExample from './subgenerators/generate-subgenerator-example/generator'

// import promptTask from './tasks/prompt'

export default function (app) {
  if (!isValid(app, 'generate-swap-rest-api')) return

  app.on('error', err => app.log.error(err))

  /**
   * Use Plugins
   */
  app.use(generateDefaults)
  app.use(generateSwapProject)

  /**
   * Register Sub Generators
   */
  app.register('destination-directory', generateDest)
  app.register('git', generateGit)
  app.register('subgenerator-example', generateSubgeneratorExample)

  /**
   * Run main task swap-rest-api. Also aliased as the [default](#default) task.
   *
   * ```sh
   * $ gen swap-rest-api:main
   * ```
   * @name main
   * @api public
   */
  // app.task('main', function (cb) {
  //   app.generate([
  //     'prompt',
  //     'dest',
  //     'subgenerator-example',
  //     'example'
  //   ], cb)
  // })

  /**
   * Scaffold out a swap-generator project using most of the swap-project plugin's tasks and the overriden tasks defined in this generator using local sub-generators. Also aliased as the [default](#default) task.
   *
   * ```sh
   * $ gen swap-generator:project
   * ```
   * @name project
   * @api public
   */
  app.task('project', function (cb) {
    app.generate([
      // from swap-project plugin
      'swap-project:prompt',
      'dest',

      // overriden by swap-generator-package local sub-generator
      'package',

      // from swap-project plugin
      'gitignore',
      'gitattributes',
      'editorconfig',
      'npmrc',
      'contributing',
      'license',

      // overriden by swap-generator-main local sub-generator
      'main',

      // overriden by swap-generator-readme local sub-generator
      'readme',

      // from swap-project plugin
      'travis',
      'gitlabci',

      // from git sub-generator
      'git:default'
    ], cb)
  })

  /**
   * Ask the user for all the required data for all the tasks in this generator.
   *
   * ```sh
   * $ gen swap-rest-api:prompt
   * ```
   * @name prompt
   * @api public
   */
  // app.task('prompt', promptTask(app))
  app.task('prompt', 'swap-project:prompt')

  /**
   * Set the destination directory for generated files.
   * Call the `destination-directory:default` task from the sub generator `destination-directory`.
   *
   * ```sh
   * $ gen swap-rest-api:dest
   * ```
   * @name dest
   * @api public
   */
  app.task('dest', function (cb) {
    app.generate(['destination-directory:default'], cb)
  })

  app.task('subgenerator-example', function (cb) {
    app.generate(['subgenerator-example:default'], cb)
  })

  /**
   * Define the example task
   *
   * ```sh
   * $ gen swap-rest-api:example
   * ```
   * @name dest
   * @api public
   */
  task(app, 'example', 'example.txt')

  /**
   * Run the default task
   *
   * ```sh
   * $ gen swap-rest-api:default
   * ```
   *
   * or simply
   *
   * ```sh
   * $ gen swap-rest-api
   * ```
   * @name default
   * @api public
   */
  app.task('default', ['project'])

  app.task('dev', ['auto-prompt', 'project'])
  app.task('auto-prompt', done => {
    app.option('prompt', false)
    const destination = path.resolve('.', process.env.DEST || 'mtest')
    console.log({destination})
    app.option('dest', destination)
    app.option('askWhen', 'not-answered')
    app.base.data({
      name: 'manual-test-restapi',
      issues: '_issues',
      namespace: '_namespace'
    })
    done()
  })
}

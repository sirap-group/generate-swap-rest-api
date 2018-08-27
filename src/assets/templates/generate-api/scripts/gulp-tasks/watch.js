const debug = require('debug')
const chalk = require('chalk')
const path = require('path')
const gulp = require('gulp')
const watch = require('gulp-watch')
const shell = require('shelljs')

const dbug = debug('swap:scripts:watch')

// Change working dir to come back to the project root
const workingDir = path.resolve(path.join(__dirname, '../../'))
process.chdir(workingDir)

const watchFiles = [
  // 'package.json', // once task splitted
  'src/**/*'// ,
  // 'src/assets/**/*.*'
  // 'scripts/**/*.js' // once task splitted
]

const watchOptions = {
  ignoreInitial: true, // default
  events: ['add', 'change', 'unlink'], // default
  // events: ['add', 'change', 'unlink', 'addDir', 'unlinkDir', 'error', 'ready', 'raw'] // all
  base: workingDir,
  name: 'watcher-all-src',
  verbose: true,
  readDelay: 10, // default
  read: false
}

/**
 * Watch all js files in src and run `pipeline:tests` on any change
 * @todo split it to several tasks for each kind of source files (src/lib, src/tests, src/docs, scripts, package.json)
 */

gulp.task('build', done => {
  dbug('building source code')
  shell.exec('DEBUG_COLORS=true yarn pipeline:build --color always', done)
})

gulp.task('watch:bdd', () => {
  dbug('watching files for ever...')
  watcher()
})

gulp.task('default', ['watch:bdd'])

function watcher () {
  watch(watchFiles, watchOptions, file => {
    dbug('handled watch event: a file has changed:', file.path)

    const sourceFilePath = file.path
    dbug(`linting file #{sourceFilePath}...`)
    shell.exec(`yarn standard #{sourceFilePath} --color always`, err => {
      if (err) {
        console.error(chalk.red('Lint error. Skip next tasks and wait for new changes.'))
      } else {
        const destFilePath = sourceFilePath.replace('/src/', '/dist/')
        dbug(`transpiling file #{sourceFilePath} to #{destFilePath}...`)
        shell.exec(`yarn babel #{sourceFilePath} --out-file #{destFilePath} --color always`, err => {
          if (err) {
            console.error(chalk.red('Transpiling error. Skip next tasks and wait for new changes.'))
          } else {
            dbug('running the tests suite...')
            shell.exec(`DEBUG_COLORS=true yarn test --color always`, err => {
              if (err) {
                console.error(chalk.red('Unit test suite has failed. Wait for new changes for passing tests.'))
              } else {
                dbug(chalk.green('Great, all tests passed !'))
              }
            })
          }
        })
      }
    })
  })
}

---
layout: false
rename:
  basename: './src/lib/app/modules/users/User.js'
---
import debug from 'debug'
import chalk from 'chalk'

import { UserModel } from './UserModel'

// import {UserRole} from './UserRole'

const dbug = debug('swap:app:modules:users:User')
dbug('loading module')

export class User {
  // constructor () {
  //   this.UserDataAccess = UserDataAccess
  //   this.UserRole = UserRole
  // }

  static async createUser (userData) {
    let user
    try {
      user = new UserModel(userData)
    } catch (err) {
      console.error(chalk.red('Validation Error trying to create new User'), err)
    }

    return user.save()
  }

  /**
   * Try to validate user authenticate
   * @param {object} userData the user data for authentication
   * @returns {boolean} if login should succedd
   */
  static async tryAuthenticate (user) {
    return true
    // return user.authenticate()
  }

  static async fetchOneByUsername (username) {
    return UserModel.findOne({username: username})
  }
}

dbug('module loaded')

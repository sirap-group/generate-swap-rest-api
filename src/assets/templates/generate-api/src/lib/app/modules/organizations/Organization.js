import debug from 'debug'
import chalk from 'chalk'

import { OrganizationModel } from './OrganizationModel'

const dbug = debug('swap:app:modules:users:Organization')
dbug('loading module')

export class Organization {
  constructor () {
    this.Model = OrganizationModel
  }

  static async create (orgData) {
    const org = new OrganizationModel(orgData)
    return org.save()
      .catch(err => {
        console.error(chalk.red('Validation Error trying to create new Organization'))
        throw err
      })
  }
}

dbug('module loaded')

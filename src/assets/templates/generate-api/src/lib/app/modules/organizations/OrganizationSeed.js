import debug from 'debug'
import chalk from 'chalk'

import { UserModel } from './UserModel'

// import {UserRole} from './UserRole'

const dbug = debug('swap:app:modules:users:UserSeed')
dbug('loading module')

export class UserSeed {
  seed () {
    return UserModel.create([{
      gender: 'male',
      firstName: 'Observer 1',
      lastName: 'Seeded',
      email: 'rbecheras@sirap.fr',
      username: 'seeded_observer_1',
      password: 'password123456',
      provider: 'local',
      roles: ['observer']
    }, {
      gender: 'female',
      firstName: 'Moderator 1',
      lastName: 'Seeded',
      email: 'rbecheras@sirap.fr',
      username: 'seeded_moderator_1',
      password: 'password123456',
      provider: 'local',
      roles: ['moderator']
    }, {
      gender: 'indeterminate',
      firstName: 'Operator 1',
      lastName: 'Seeded',
      email: 'rbecheras@sirap.fr',
      username: 'seeded_operator_1',
      password: 'password123456',
      provider: 'local',
      roles: ['operator']
    }, {
      gender: 'male',
      firstName: 'Supervisor 1',
      lastName: 'Seeded',
      email: 'rbecheras@sirap.fr',
      username: 'seeded_supervisor_1',
      password: 'password123456',
      provider: 'local',
      roles: ['supervisor']
    }])
  }
}

dbug('module loaded')

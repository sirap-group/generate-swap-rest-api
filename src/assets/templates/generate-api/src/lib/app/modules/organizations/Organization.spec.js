import debug from 'debug'
// import chalk from 'chalk'
import 'mocha'
// import chai from 'chai'

// import { OrganizationModel } from './OrganizationModel'
// import { Organization } from './Organization'

const dbug = debug('swap:app:modules:users:Organization:spec')
dbug('loading module')

// const expect = chai.expect
// let organization

describe('class Organization', function () {
  this.slow(250)
  this.timeout(4000)

  beforeEach(() => {
    // organization = new OrganizationModel()
  })

  it('should have a .create() static method')
  it('should have a .fetchAll() static method')
  it('should have a .fetchOne() static method')

  describe('.create()', async () => {
    it('should create a new organization with the given unique name')
    it('should failds creating a new organization with a name that already exist')
  })

  describe('new Organization()', () => {
    it('should be an object')
  })
})

dbug('module loaded')

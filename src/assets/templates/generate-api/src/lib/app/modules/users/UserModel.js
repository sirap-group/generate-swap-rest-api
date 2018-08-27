---
layout: false
rename:
  basename: './src/lib/app/modules/users/UserModel.js'
---
import debug from 'debug'

import mongoose from 'mongoose'
import crypto from 'crypto'

import { Organization } from '../organizations/Organization'

const dbug = debug('swap:app:modules:users:UserModel')
dbug('loading module')

const Schema = mongoose.Schema

/**
 * A Validation function for local strategy properties
 */
const validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length)
}

/**
 * A Validation function for local strategy password
 */
const validateLocalStrategyPassword = function (password) {
  return (this.provider !== 'local' || (password && password.length > 6))
}

/**
 * User Schema
 */
const UserSchema = new Schema({
  organization: {
    type: Schema.ObjectId,
    // required: 'Any user must belong to one organization',
    ref: Organization.Model
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'indeterminate'],
    default: 'indeterminate',
    required: true
  },
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  username: {
    type: String,
    unique: 'testing error message',
    required: 'Please fill in a username',
    trim: true
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password should be longer']
  },
  salt: {
    type: String
  },
  provider: {
    type: String
    // required: true
    // required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: [
        'rootAdmin',
        'orgAdmin',
        'teamAdmin',
        'locationAdmin',
        'activityAdmin',
        'supervisor',
        'controller',
        'operator',
        'observer'
      ],
      required: true
    }],
    default: ['observer']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
})

UserSchema.pre('save', function (next) {
  if (this.passwordUpdating) {
    this.password = this.hashedPassword
    this.hashedPassword = undefined
    this.resetPasswordToken = undefined
    this.resetPasswordExpires = undefined
  }
  next()
})

/**
 * Create instance method for updating a password
 */
UserSchema.methods.updatePassword = function (password) {
  if (password && password.length > 6) {
    this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64')
    this.password = password
    this.hashedPassword = this.hashPassword(password)
    this.passwordUpdating = true
  } else {
    this.passwordUpdating = undefined
    this.hashedPassword = undefined
  }
}

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  let hash
  if (this.salt && password) {
    const passwordBuffer = Buffer.from(password, 'binary')
    const saltBuffer = Buffer.from(this.salt, 'binary')
    const iteration = 10000
    const hashLength = 64
    const hashAlgo = 'sha1'
    const hashEncoding = 'base64'
    hash = crypto.pbkdf2Sync(passwordBuffer, saltBuffer, iteration, hashLength, hashAlgo).toString(hashEncoding)
  } else {
    hash = password
  }
  return hash
}

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password)
}

UserSchema.methods.hasRole = function (role) {
  return role === 'user' || (Array.isArray(this.roles) && !!~this.roles.indexOf(role))
}

UserSchema.methods.hasNotRole = function (role) {
  return !this.hasRole(role)
}

UserSchema.methods.isGod = function () {
  return this.hasRole('god')
}

UserSchema.methods.isSuperAdmin = function () {
  return this.hasRole('superadmin')
}

UserSchema.methods.isAdmin = function () {
  return this.hasRole('admin')
}

UserSchema.methods.isGrantedAdminOverOther = function (otherUser) {
  if (otherUser.isSuperAdmin() && this.isGod()) {
    return true
  }
  if (otherUser.isAdmin() && (this.isSuperAdmin() || this.isGod())) {
    return true
  }
  return this.isAdmin()
}

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  const _this = this
  const possibleUsername = username + (suffix || '')

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername)
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback)
      }
    } else {
      callback(null)
    }
  })
}

const UserModel = mongoose.model('User', UserSchema)

export {UserModel}

dbug('module loaded')

import debug from 'debug'

import mongoose from 'mongoose'

const dbug = debug('swap:app:modules:users:OrganizationModel')
dbug('loading module')

const Schema = mongoose.Schema

/**
 * Organization Mongoose Schema
 */
const OrganizationSchema = new Schema({
  // partner: {
  //   type: Schema.ObjectId,
  //   required: 'Any organization must belong to one partner',
  //   ref: 'Partner'
  // },
  name: {
    type: String,
    unique: 'An organization already exists with this name',
    required: 'Please fill in a name for the organization',
    trim: true
  },
  email: {
    type: String,
    trim: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  defaultProvider: {
    type: String,
    required: false
  },
  defaultProviderData: {},
  defaultAdditionalProvidersData: {},
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
})

const OrganizationModel = mongoose.model('Organization', OrganizationSchema)

export {OrganizationModel}

dbug('module loaded')

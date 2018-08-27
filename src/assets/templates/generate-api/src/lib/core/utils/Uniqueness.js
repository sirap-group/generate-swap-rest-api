---
layout: false
rename:
  basename: './src/lib/core/utils/Uniqueness.js'
---
import uuid from 'uuid'
import sha1 from 'crypto-js/sha1'
import assert from 'assert'

/**
 * Provide static methods to deal with unique values
 */
export class Uniqueness {
  /**
   * Postfix a string with a unique string chunk of a desired length
   * @param {string} prefix the static prefix to use for the returned value
   * @param {number} postfixLength the desired length of the entire returned string
   * @returns {String} the postfixed string
   */
  static asPostfix (prefix, postfixLength = 6) {
    let totalLength = Number(String(prefix).length) + postfixLength
    assert.ok(!isNaN(postfixLength), 'second argument must be a number')
    return String(prefix).concat(sha1(uuid.v4())).toString().slice(0, totalLength)
  }
}

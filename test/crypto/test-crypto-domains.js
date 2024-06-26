// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';
const common = require('../common');
if (!common.hasCrypto)
  common.skip('missing crypto');

const domain = require('domain');
const assert = require('assert');
const crypto = require('crypto');

const d = domain.create();
const expect = ['pbkdf2', 'randomBytes', 'pseudoRandomBytes'];

d.on('error', common.mustCall(function(e) {
  assert.strictEqual(e.message, expect.shift());
}, 3));

d.run(function() {
  one();

  function one() {
    crypto.pbkdf2('a', 'b', 1, 8, 'sha1', function() {
      two();
      throw new Error('pbkdf2');
    });
  }

  function two() {
    crypto.randomBytes(4, function() {
      three();
      throw new Error('randomBytes');
    });
  }

  function three() {
    crypto.pseudoRandomBytes(4, function() {
      throw new Error('pseudoRandomBytes');
    });
  }
});

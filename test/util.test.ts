import assert from 'assert';
import { encryptRSA, encodeToFileString } from '../lib/util';

describe('Util', function () {
  it('can encrypt RSA', function () {
    const publicKey =
      'MIIBIjANBgkqhkiG9w0BAQ' +
      'EFAAOCAQ8AMIIBCgKCAQEAuhRrVDeMf' +
      'b2fBaf8WmtGcQ23Cie+qDQqnkKG9eZV' +
      'yJdEvP1rLca+0CUOuAnpE8yGPY3HEbd' +
      'xKTsbIxxV9H8DCEMntXq2VP4loQoYUl' +
      '0h9dTjtBVWvhYev0s7N5B8Qu9LtykE2' +
      'k9KBuSZ+5dXulnHYdYjBaifZL6pzoD1' +
      'ckXoa4TtIuPjZZGXzr3Ivt5LDxPoPfw' +
      '1qMdqWRF9/YQSK1jZYa7PNR1Hbd8KB8' +
      '85VEcXNRU7ADHSgdYRBYB8apsPwaChy' +
      'jgrV98ATLOD7Dl4RlPtXcx/vEKjVMdt' +
      'CqJ2IHKeJoUCzBPY59U/mtIhjPuQmwS' +
      'MLEnLisDWEZMkenO0xJbwOwIDAQAB';

    const result = encryptRSA(publicKey, 'hello world');
    assert.ok(!!result);
  });

  it('can file encoding to string', async function () {
    const result = await encodeToFileString(
      __dirname + '/dummy_for_encoding.txt'
    );
    assert.equal('aGVsbG8gd29ybGQ=', result);
  });
});

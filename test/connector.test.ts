import assert from 'assert';
import { requestToken, requestProduct, execute } from '../lib/connector';
import {
  SERVICE_TYPE_SANDBOX,
  CREATE_ACCOUNT,
  SERVICE_TYPE_API,
} from '../lib/constant';
import { EasyCodef } from '../lib';
import { createParamForCreateConnectedID } from './helper';
import debug from 'debug';
const log = debug('test');

describe('Connector', function () {
  it('can request token', async function () {
    const codef = new EasyCodef();
    const token = await requestToken(SERVICE_TYPE_SANDBOX, codef);
    assert.ok(!!token);
  });

  it('can request product', async function () {
    const codef = new EasyCodef();
    const param = createParamForCreateConnectedID();

    const data = JSON.parse(
      await requestProduct(SERVICE_TYPE_SANDBOX, `/failPath`, codef, param)
    );

    assert.equal('CF-00404', data.result.code);
  });

  it('can execute reuqest', async function () {
    const codef = new EasyCodef();
    const param = createParamForCreateConnectedID();
    const data = JSON.parse(
      await execute(codef, SERVICE_TYPE_SANDBOX, CREATE_ACCOUNT, param)
    );

    assert.equal('CF-00000', data.result.code);
    assert.ok(!!data.data.connectedId);
  });

  it('requestToken can return a current valid token', async function () {
    const codef = new EasyCodef();
    const token1 = await codef.requestToken(SERVICE_TYPE_SANDBOX);
    codef.setAccessToken(SERVICE_TYPE_SANDBOX, token1);
    const token2 = await codef.requestToken(SERVICE_TYPE_SANDBOX);
    assert.equal(token1, token2);
  });

  it('requestToken can check expired token', async function () {
    const codef = new EasyCodef();

    const token = await codef.requestToken(SERVICE_TYPE_SANDBOX);
    codef.setAccessToken(SERVICE_TYPE_SANDBOX, token);
    const currentToken = await codef.requestToken(SERVICE_TYPE_SANDBOX);
    assert.equal(token, currentToken);

    const expiredToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlX3R5cGUiOiIyIiwic2NvcGUiOlsicmVhZCJdLCJzZXJ2aWNlX25vIjoiMDAwMDAwMDAwMDAwIiwiZXhwIjoxNjAwOTEzMTU4LCJhdXRob3JpdGllcyI6WyJSRUxBWSJdLCJqdGkiOiJkNTgxMzA0Zi01NDI4LTRiZjYtYWMwYS1kNzY1OTJiMjcwMjMiLCJjbGllbnRfaWQiOiI1MDM4YTYzNS00ZjJkLTQ2MDUtOTI1ZS0wMTk5MDM1MTIyYjgifQ.lJQ8v9EXjM2KJJoNAWGHJN83Qm7ftuKEOkmM2iyq4dWbWRMxvcRbmF-FTC0rwmIhWfwn_Cr4mx9QW4uJjxqt6L2bCpRYILctAHx3MG8Ud5sdp37BHR_lkwQqQog7_pMj2b1cqMug1ij8ci3r8u_6QxKbN3YmTCCTYU-vAXlqT_z5Au7QoAt8bMFkINGg9sFA08K8Z0IbVdyP0eYZRgYD3VOkKX4aek8rFuXLEChtscpGcPfhG65IbKpVgk-Yo859yusJVH6RSFNoJo9Vmx_GF-yaCWxe_zfronOkKgzBMR5XfU8-mxu0TbqlV3OEL-37jCO7K1GnzoMqBSV_hph2-Q';
    codef.setAccessToken(SERVICE_TYPE_SANDBOX, expiredToken);
    const newToken = await codef.requestToken(SERVICE_TYPE_SANDBOX);
    assert.notEqual(expiredToken, newToken);
  });
});

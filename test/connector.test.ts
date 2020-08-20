import assert from 'assert';
import { requestToken, requestProduct, execute } from '../lib/connector';
import { SERVICE_TYPE_SANDBOX, CREATE_ACCOUNT } from '../lib/constant';
import { EasyCodef } from '../lib';
import { createParamForCreateConnectedID } from './helper';

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
});

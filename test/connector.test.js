const assert = require('assert');
const { requestToken, requestProduct, execute } = require('../lib/connector');
const { SERVICE_TYPE_SANDBOX, CREATE_ACCOUNT } = require('../lib/constant');
const Easycodef = require('../lib/easycodef');
const { createParamForCreateConnectedID } = require('./helper');

describe('Connector', function () {
  it('can request token', async function () {
    const codef = new Easycodef();
    const token = await requestToken(SERVICE_TYPE_SANDBOX, codef);
    assert.ok(!!token);
  });

  it('can request product', async function () {
    const codef = new Easycodef();
    const param = createParamForCreateConnectedID();

    const data = JSON.parse(
      await requestProduct(SERVICE_TYPE_SANDBOX, `/failPath`, codef, param)
    );

    assert.equal('CF-00404', data.result.code);
  });

  it('can execute reuqest', async function () {
    const codef = new Easycodef();
    const param = createParamForCreateConnectedID();
    const data = JSON.parse(
      await execute(codef, SERVICE_TYPE_SANDBOX, CREATE_ACCOUNT, param)
    );

    assert.equal('CF-00000', data.result.code);
    assert.ok(!!data.data.connectedId);
  });
});

import assert from 'assert';
import { EasyCodef } from '../lib';
const {
  CREATE_ACCOUNT,
  SERVICE_TYPE_API,
  SERVICE_TYPE_SANDBOX,
  SERVICE_TYPE_DEMO,
} = require('../lib/constant');
const { createParamForCreateConnectedID } = require('./helper');

describe('EasyCodef', function () {
  it('can request product', async function () {
    const codef = new EasyCodef();

    const param = createParamForCreateConnectedID();
    // 클라이언트 정보 셋팅하지 않았을때
    let data = JSON.parse(
      await codef.requestProduct(CREATE_ACCOUNT, SERVICE_TYPE_API, param)
    );
    assert.equal('CF-00014', data.result.code);

    // 데모에 영향을 주었는지 테스트
    data = JSON.parse(
      await codef.requestProduct(CREATE_ACCOUNT, SERVICE_TYPE_DEMO, param)
    );
    assert.equal('CF-00014', data.result.code);

    // 퍼블릭키 정보 셋팅하지 않았을때
    codef.setClientInfo('client_id', 'client_secret');
    data = JSON.parse(
      await codef.requestProduct(CREATE_ACCOUNT, SERVICE_TYPE_API, param)
    );
    assert.equal('CF-00015', data.result.code);
  });

  it('can sandbox creates account with requestProduct()', async function () {
    const codef = new EasyCodef();
    // 샌드박스 클라이언트 정보는 기본 셋팅 되어 있기 때문에
    // 퍼블릭 키만 셋팅하면 된다.
    codef.setPublicKey('public_key');

    const param = createParamForCreateConnectedID();
    const data = JSON.parse(
      await codef.requestProduct(CREATE_ACCOUNT, SERVICE_TYPE_SANDBOX, param)
    );

    assert.equal('CF-00000', data.result.code);
    assert.ok(!!data.data.connectedId);
  });

  it('can request token', async function () {
    const codef = new EasyCodef();
    const data = await codef.requestToken(SERVICE_TYPE_SANDBOX);
    assert.ok(!!data);
  });

  it('can get cid list', async function () {
    const codef = new EasyCodef();
    codef.setPublicKey('public_key');
    const param = createParamForCreateConnectedID();
    const data = JSON.parse(
      await codef.getConnectedIdList(SERVICE_TYPE_SANDBOX, param)
    );
    assert.ok(data.data.connectedIdList.length > 0);
  });

  it('can create account', async function () {
    const codef = new EasyCodef();
    codef.setPublicKey('public_key');
    const param = createParamForCreateConnectedID();
    const data = JSON.parse(
      await codef.createAccount(SERVICE_TYPE_SANDBOX, param)
    );
    assert.ok(!!data.data.connectedId);
  });

  it('can get account list', async function () {
    const codef = new EasyCodef();
    codef.setPublicKey('public_key');
    const param = createParamForCreateConnectedID();
    const data = JSON.parse(
      await codef.getAccountList(SERVICE_TYPE_SANDBOX, param)
    );
    assert.ok(data.data.accountList.length > 0);
  });
});

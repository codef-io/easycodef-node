import assert from 'assert';
import { AccessToken } from '../lib/accesstoken';
import {
  SERVICE_TYPE_SANDBOX,
  SERVICE_TYPE_DEMO,
  SERVICE_TYPE_API,
} from '../lib/constant';

describe('AccessToken', function () {
  it('get/set token by service type', function () {
    const dummyToken = 'hello';
    const accessToken = new AccessToken();

    // for sandbox
    accessToken.setToken(SERVICE_TYPE_SANDBOX, dummyToken);
    assert.equal(dummyToken, accessToken.getToken(SERVICE_TYPE_SANDBOX));

    // for demo
    accessToken.setToken(SERVICE_TYPE_DEMO, dummyToken);
    assert.equal(dummyToken, accessToken.getToken(SERVICE_TYPE_DEMO));

    // for api
    accessToken.setToken(SERVICE_TYPE_API, dummyToken);
    assert.equal(dummyToken, accessToken.getToken(SERVICE_TYPE_API));
  });
});

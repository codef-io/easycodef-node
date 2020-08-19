const {
  SERVICE_TYPE_API,
  SERVICE_TYPE_DEMO,
  API_DOMAIN,
  SANDBOX_DOMAIN,
  DEMO_DOMAIN,
  SANDBOX_CLIENT_ID,
  SANDBOX_CLIENT_SECRET,
} = require('./constant');

class EasycodefProperties {
  constructor() {
    this.clientID = '';
    this.clientSecret = '';
    this.demoClientID = '';
    this.demoClientSecret = '';
    this.sandboxClientID = SANDBOX_CLIENT_ID;
    this.sandboxClientSecret = SANDBOX_CLIENT_SECRET;
  }

  /**
   * 정식서버 사용을 위한 클라이언트 정보 설정
   * @param clientID
   * @param clientSecret
   */
  setClientInfo(clientID, clientSecret) {
    this.clientID = clientID;
    this.clientSecret = clientSecret;
  }

  /**
   * 데모서버 사용을 위한 클라이언트 정보 설정
   * @param clientID
   * @param clientSecret
   */
  setDemoClientInfo(clientID, clientSecret) {
    this.demoClientID = clientID;
    this.demoClientSecret = clientSecret;
  }

  /**
   * 상품 요청 URL
   * @param productURLPath
   * @returns {string}
   */
  getProductRequestURL(serviceType, productURLPath) {
    switch (serviceType) {
      case SERVICE_TYPE_API:
        return API_DOMAIN + productURLPath;
      case SERVICE_TYPE_DEMO:
        return DEMO_DOMAIN + productURLPath;
      default:
        return SANDBOX_DOMAIN + productURLPath;
    }
  }

  /**
   * RSA암호화를 위한 퍼블릭키 설정
   * @param publicKey
   */
  setPublicKey(publicKey) {
    this.PUBLIC_KEY = publicKey;
  }

  /**
   * 클라이언트 정보 조회
   * @param {SERVICE_TYPE} serviceType
   */
  getClientInfo(serviceType) {
    switch (serviceType) {
      case SERVICE_TYPE_API:
        return { clientID: this.clientID, clientSecret: this.clientSecret };
      case SERVICE_TYPE_DEMO:
        return {
          clientID: this.demoClientID,
          clientSecret: this.demoClientSecret,
        };
      default:
        return {
          clientID: this.sandboxClientID,
          clientSecret: this.sandboxClientSecret,
        };
    }
  }
}

module.exports = EasycodefProperties;

const easyCodefConstant = require("./constant");

class EasycodefProperties {
  /**
   * 정식서버 사용을 위한 클라이언트 정보 설정
   * @param clientID
   * @param clientSecret
   */
  setClientInfo(clientID, clientSecret) {
    this.CLIENT_ID = clientID;
    this.CLIENT_SECRET = clientSecret;
  }

  /**
   * 데모서버 사용을 위한 클라이언트 정보 설정
   * @param clientID
   * @param clientSecret
   */
  setDemoClientInfo(clientID, clientSecret) {
    this.DEMO_CLIENT_ID = clientID;
    this.DEMO_CLIENT_SECRET = clientSecret;
  }

  /**
   * 상품 요청 URL
   * @param productURL
   * @returns {string}
   */
  getProductRequestURL(serviceType, productURL) {
    switch (serviceType) {
      case easyCodefConstant.SERVICE_TYPE_API:
        return easyCodefConstant.API_DOMAIN + productURL;
      case easyCodefConstant.SERVICE_TYPE_DEMO:
        return easyCodefConstant.DEMO_DOMAIN + productURL;
      default:
        return easyCodefConstant.SANDBOX_DOMAIN + productURL;
    }
  }

  /**
   * RSA암호화를 위한 퍼블릭키 설정
   * @param publicKey
   */
  setPublicKey(publicKey) {
    this.PUBLIC_KEY = publicKey;
  }
}

module.exports = EasycodefProperties;

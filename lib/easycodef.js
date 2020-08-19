const easyCodefConstant = require('./constant');
const easyCodefConnector = require('./connector');
const EasycodefProperties = require('./properties');
const EasyCodefAcessToken = require('./accesstoken');
const {
  getResponseMessageConstant,
  EMPTY_CLIENT_INFO,
  EMPTY_PUBLIC_KEY,
} = require('./messageconstant');

/**
 * 코드에프의 쉬운 사용을 위한 유틸 라이브러리 클래스
 */
class Easycodef {
  constructor() {
    this.properties = new EasycodefProperties();
    this.accessToken = new EasyCodefAcessToken();
  }

  /**
   * RSA 암호화를 위한 퍼블릭키 설정
   * @param key
   */
  setPublicKey(publickey) {
    this.properties.setPublicKey(publickey);
  }

  /**
   *  RSA암호화를 위한 퍼블릭키
   */
  getPublicKey() {
    return this.properties.PUBLIC_KEY;
  }

  /**
   * 정식서버 사용을 위한 클라이언트 정보 설정
   * @param realClientId
   * @param realClientSecret
   */
  setClientInfo(clientID, clientSecret) {
    this.properties.setClientInfo(clientID, clientSecret);
  }

  /**
   * 데모서버 사용을 위한 클라이언트 정보 설정
   * @param demoClientId
   * @param demoClientSecret
   */
  setClientInfoForDemo(clientID, clientSecret) {
    this.properties.setDemoClientInfo(clientID, clientSecret);
  }

  /**
   * 서비스별 토큰 설정
   * @param serviceType
   * @param token
   */
  setAccessToken(serviceType, token) {
    this.accessToken.setToken(serviceType, token);
  }

  /**
   * 서비스별 토큰 가져오기
   * @param serviceType
   */
  getAccessToken(serviceType) {
    return this.accessToken.getToken(serviceType);
  }

  /**
   * 클라이언트 정보 조회
   * @param {*} serviceType
   */
  getClientInfo(serviceType) {
    return this.properties.getClientInfo(serviceType);
  }

  /**
   * 서비스 타입에 따른 클라이언트 정보 설정 확인
   * @returns {boolean}
   */
  checkClientInfo(serviceType) {
    const { clientID, clientSecret } = this.getClientInfo(serviceType);
    return clientID && clientSecret;
  }

  /**
   * 상품 요청 URL
   * @param serviceType
   * @param productURL
   * @returns {string}
   */
  getProductRequestURL(serviceType, productURL) {
    return this.properties.getProductRequestURL(serviceType, productURL);
  }

  /**
   * 상품 요청
   * @param productURL
   * @param serviceType
   * @param parameterMap
   */
  requestProduct(productURL, serviceType, param) {
    // 1.필수 항목 체크 - 클라이언트 정보
    if (!this.checkClientInfo(serviceType)) {
      return getResponseMessageConstant(EMPTY_CLIENT_INFO);
    }
    // 2.필수 항목 체크 - 퍼블릭 키
    if (!this.getPublicKey()) {
      return getResponseMessageConstant(EMPTY_PUBLIC_KEY);
    }

    return easyCodefConnector.execute(this, serviceType, productURL, param);
  }

  /**
   * 서비스별 (정식/데모/샌드박스)토큰발급 요청
   * @param serviceType
   */
  requestToken(serviceType) {
    return easyCodefConnector.requestToken(serviceType, this);
  }

  /**
   * 서비스별 계정 목록 조회
   * @param serviceType
   * @param paramMap
   */
  getConnectedIdList(serviceType, param) {
    return this.requestProduct(
      easyCodefConstant.GET_CID_LIST,
      serviceType,
      param
    );
  }

  /**
   * connectedId 발급을 위한 계정 등록
   * @param serviceType
   * @param paramMap
   */
  createAccount(serviceType, param) {
    return this.requestProduct(
      easyCodefConstant.CREATE_ACCOUNT,
      serviceType,
      param
    );
  }

  /**
   * connectedId로 등록된 계정 목록 조회
   * @param serviceType
   * @param paramMap
   */
  getAccountList(serviceType, param) {
    return this.requestProduct(
      easyCodefConstant.GET_ACCOUNT_LIST,
      serviceType,
      param
    );
  }

  /**
   *  계정 정보 추가
   * @param serviceType
   * @param param
   */
  addAccount(serviceType, param) {
    return this.requestProduct(
      easyCodefConstant.ADD_ACCOUNT,
      serviceType,
      param
    );
  }

  /**
   *  계정 정보 삭제
   * @param serviceType
   * @param param
   */
  deleteAccount(serviceType, param) {
    return this.requestProduct(
      easyCodefConstant.DELETE_ACCOUNT,
      serviceType,
      param
    );
  }

  /**
   * Comment  : 계정 정보 수정
   * @param serviceType
   * @param param
   */
  updateAccount(serviceType, param) {
    return this.requestProduct(
      easyCodefConstant.UPDATE_ACCOUNT,
      serviceType,
      param
    );
  }
}

module.exports = Easycodef;

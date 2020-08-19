const {
  SERVICE_TYPE_SANDBOX,
  SERVICE_TYPE_DEMO,
  SERVICE_TYPE_API,
} = require('./constant');

/**
 *  서비스 별 토큰 관리 클래스
 */
module.exports = class accessToken {
  constructor() {
    this.sandbox = '';
    this.demo = '';
    this.api = '';
  }

  setToken(serviceType, accessToken) {
    switch (serviceType) {
      case SERVICE_TYPE_API:
        this.api = accessToken;
        break;
      case SERVICE_TYPE_DEMO:
        this.demo = accessToken;
        break;
      default:
        this.sandbox = accessToken;
    }
  }

  getToken(serviceType) {
    switch (serviceType) {
      case SERVICE_TYPE_API:
        return this.api;
      case SERVICE_TYPE_DEMO:
        return this.demo;
      default:
        return this.sandbox;
    }
  }
};

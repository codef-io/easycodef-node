import { ServiceType } from './constant';

const {
  SERVICE_TYPE_API,
  SERVICE_TYPE_DEMO,
  API_DOMAIN,
  SANDBOX_DOMAIN,
  DEMO_DOMAIN,
  SANDBOX_CLIENT_ID,
  SANDBOX_CLIENT_SECRET,
} = require('./constant');

export type ClientInfo = {
  clientID: string;
  clientSecret: string;
};

export class Properties {
  private publicKey: string;
  private clientID: string;
  private clientSecret: string;
  private demoClientID: string;
  private demoClientSecret: string;
  private readonly sandboxClientID: string = SANDBOX_CLIENT_ID;
  private readonly sandboxClientSecret: string = SANDBOX_CLIENT_SECRET;

  constructor() {
    this.clientID = '';
    this.clientSecret = '';
    this.demoClientID = '';
    this.demoClientSecret = '';
    this.publicKey = '';
  }

  /**
   * 정식서버 사용을 위한 클라이언트 정보 설정
   * @param clientID
   * @param clientSecret
   */
  setClientInfo(clientID: string, clientSecret: string) {
    this.clientID = clientID;
    this.clientSecret = clientSecret;
  }

  /**
   * 데모서버 사용을 위한 클라이언트 정보 설정
   * @param clientID
   * @param clientSecret
   */
  setDemoClientInfo(clientID: string, clientSecret: string) {
    this.demoClientID = clientID;
    this.demoClientSecret = clientSecret;
  }

  /**
   * 상품 요청 URL
   * @param productURLPath
   * @returns {string}
   */
  getProductRequestURL(
    serviceType: ServiceType,
    productURLPath: string
  ): string {
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
  setPublicKey(publicKey: string) {
    this.publicKey = publicKey;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  /**
   * 클라이언트 정보 조회
   * @param {ServiceType} serviceType
   */
  getClientInfo(serviceType: ServiceType): ClientInfo {
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

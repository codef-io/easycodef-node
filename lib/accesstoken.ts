import { SERVICE_TYPE_DEMO, SERVICE_TYPE_API, ServiceType } from './constant';

/**
 *  서비스 별 토큰 관리 클래스
 */
export class AccessToken {
  private sandbox: string;
  private demo: string;
  private api: string;

  constructor() {
    this.sandbox = '';
    this.demo = '';
    this.api = '';
  }

  setToken(serviceType: ServiceType, accessToken: string) {
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

  getToken(serviceType: ServiceType): string {
    switch (serviceType) {
      case SERVICE_TYPE_API:
        return this.api;
      case SERVICE_TYPE_DEMO:
        return this.demo;
      default:
        return this.sandbox;
    }
  }
}

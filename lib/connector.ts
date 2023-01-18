import { OAUTH_DOMAIN, GET_TOKEN, REPEAT_COUNT, ServiceType } from './constant';
import {
  getResponseMessageConstant,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
} from './messageconstant';
import request from 'request';
import { Response } from 'request';
import { EasyCodef } from './easycodef';

/**
 *  CODEF API 통신요청
 * @param codef
 * @param serviceType
 * @param productURL
 * @param param
 * @returns {Promise<unknown>}
 */
export async function execute(
  codef: EasyCodef,
  serviceType: ServiceType,
  productURL: string,
  param: any
): Promise<string> {
  // 토큰 셋팅
  await setToken(serviceType, codef);
  // 상품 요청
  const result = await requestProduct(serviceType, productURL, codef, param);

  if (result === 'invalid_token') {
    // 액세스 토큰 유효기간 만료시 재 요청
    codef.setAccessToken(serviceType, '');
    return await execute(codef, serviceType, productURL, param);
  }
  return result;
}

/**
 * 코드에프 상품요청
 * @param serviceType 서비스 타입
 * @param productURLPath API URL Path
 * @param codef Easycodef 인스턴스
 * @param param 요청 파라미터
 */
export function requestProduct(
  serviceType: ServiceType,
  productURLPath: string,
  codef: EasyCodef,
  param: any
): Promise<string> {
  return new Promise(function (resolve, reject) {
    let options = createReqProductOptions(serviceType, productURLPath, codef);
    request
      .post(options, (error: any, response: Response) => {
        if (error) {
          reject(error);
        }

        let result = '';
        // + 응답결과 처리
        if (response.statusCode === 200) {
          result = response.body ? decodeString(response.body) : response.body;
        } else {
          let bodyError = JSON.parse(response.body ? decodeString(response.body) : response.body).error;
          if (bodyError === 'invalid_token') {
            result = bodyError;
          }else {
            result = getErrorMsgResult(response.statusCode);
          }
        }
        resolve(result);
      })
      .write(encodeURIComponent(JSON.stringify(param)));
  });
}

/**
 * Response 상태 코드에 따라 에러 메시지 정보 가져오기
 * @param statusCode http 상태 코드
 */
function getErrorMsgResult(statusCode: number): string {
  switch (statusCode) {
    case 401:
      return getResponseMessageConstant(UNAUTHORIZED);
    case 403:
      return getResponseMessageConstant(FORBIDDEN);
    case 404: // HTTP Status-Code 404: Not Found.
      return getResponseMessageConstant(NOT_FOUND);
    default:
      return getResponseMessageConstant(SERVER_ERROR);
  }
}

/**
 * 상품 요청 옵션 생성
 *
 * @param {ServiceType} serviceType
 * @param {string} productURLPath
 * @param {string} token
 */
function createReqProductOptions(
  serviceType: ServiceType,
  productURLPath: string,
  codef: EasyCodef
): any {
  const options: any = {
    url: codef.getProductRequestURL(serviceType, productURLPath),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (codef.getAccessToken(serviceType)) {
    options.headers.Authorization = `Bearer ${codef.getAccessToken(
      serviceType
    )}`;
  }

  return options;
}

export async function setToken(serviceType: ServiceType, codef: EasyCodef) {
  if (codef.getAccessToken(serviceType)) {
    return;
  }

  for (let i = 0; i < REPEAT_COUNT; i++) {
    const token = await requestToken(serviceType, codef);
    if (token) {
      codef.setAccessToken(serviceType, token);
      break;
    }
  }
}

/**
 *  토큰발급 요청
 * @param serviceType
 * @param codef
 * @returns {Promise<unknown>}
 */
export function requestToken(
  serviceType: ServiceType,
  codef: EasyCodef
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 클라이언트 정보 조회
    const { clientID, clientSecret } = codef.getClientInfo(serviceType);
    // 옵션 셋팅
    let options = createReqTokenOptions(clientID, clientSecret);

    request
      .post(options, (err: any, response: Response) => {
        if (err) {
          reject(err);
        }

        if (response && response.statusCode === 200) {
          let token = JSON.parse(response.body).access_token;
          resolve(token);
        } else {
          reject(`Response status code ${response.statusCode}`);
        }
      })
      .write('grant_type=client_credentials&scope=read');
  });
}

/**
 * 토큰 요청 옵션 생성
 * @param {string} clientID
 * @param {string} clientSecret
 */
function createReqTokenOptions(clientID: string, clientSecret: string): any {
  return {
    url: OAUTH_DOMAIN + GET_TOKEN,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientID + ':' + clientSecret).toString('base64'),
    },
  };
}

/**
 *  서버 인코딩 응답 data 디코딩
 * @param str
 * @returns {string}
 */
function decodeString(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g,' '));
  } catch (e) {
    return unescape(decodeURI(str));
  }
}

module.exports = {
  execute,
  requestProduct,
  requestToken,
};

const { OAUTH_DOMAIN, GET_TOKEN, REPEAT_COUNT } = require('./constant');
const easyCodefMsg = require('./messageconstant');
const easyCodefMsgGetResponse = easyCodefMsg.getResponseMessageConstant;
const request = require('request');

/**
 *  CODEF API 통신요청
 * @param codef
 * @param serviceType
 * @param productURL
 * @param param
 * @returns {Promise<unknown>}
 */
async function execute(codef, serviceType, productURL, param) {
  // 토큰 셋팅
  await setToken(serviceType, codef);
  // 상품 요청
  const result = await requestProduct(serviceType, productURL, codef, param);

  let bodyError = JSON.parse(result).error;
  if (bodyError === 'invalid_token') {
    // 액세스 토큰 유효기간 만료시 재 요청
    codef.setAccessToken(serviceType, '');
    return await execute(codef, serviceType, productURL, param);
  }

  return result;
}

/**
 * CODEF 상품 요청
 * @param token
 * @returns {Promise<unknown>}
 */
function requestProduct(serviceType, productURLPath, codef, param) {
  return new Promise(function (resolve, reject) {
    let options = createReqProductOptions(serviceType, productURLPath, codef);
    request
      .post(options, (error, response) => {
        if (error) {
          reject(error);
        }

        let result = '';
        // + 응답결과 처리
        if (response.statusCode === 200) {
          result = response.body ? decodeString(response.body) : response.body;
        } else {
          result = getErrorMsgResult(response.statusCode);
        }
        resolve(result);
      })
      .write(encodeURIComponent(JSON.stringify(param)));
  });
}

/**
 * Response 상태 코드에 따라 에러 메시지 정보 가져오기
 * @param {number} statusCode
 */
function getErrorMsgResult(statusCode) {
  switch (statusCode) {
    case 401:
      return easyCodefMsgGetResponse(easyCodefMsg.UNAUTHORIZED);
    case 403:
      return easyCodefMsgGetResponse(easyCodefMsg.FORBIDDEN);
    case 404: // HTTP Status-Code 404: Not Found.
      return easyCodefMsgGetResponse(easyCodefMsg.NOT_FOUND);
    default:
      return easyCodefMsgGetResponse(easyCodefMsg.SERVER_ERROR);
  }
}

/**
 * 상품 요청 옵션 생성
 *
 * @param {SERVICE_TYPE} serviceType
 * @param {string} productURLPath
 * @param {string} token
 */
function createReqProductOptions(serviceType, productURLPath, codef) {
  const options = {
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

async function setToken(serviceType, codef) {
  if (codef.getAccessToken(serviceType)) {
    return;
  }

  for (let i = 0; i < REPEAT_COUNT; i++) {
    const token = await requestToken(serviceType, codef);
    if (token) {
      codef.setAccessToken(token);
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
function requestToken(serviceType, codef) {
  return new Promise((resolve, reject) => {
    let token = codef.getAccessToken(serviceType);
    if (token) {
      resolve(token);
      return;
    }
    // 클라이언트 정보 조회
    const { clientID, clientSecret } = codef.getClientInfo(serviceType);
    // 옵션 셋팅
    let options = createReqTokenOptions(clientID, clientSecret);

    request
      .post(options, (err, response) => {
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
function createReqTokenOptions(clientID, clientSecret) {
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
function decodeString(str) {
  try {
    return decodeURIComponent(decodeURI(str).replace(/\+/g, ' '));
  } catch (e) {
    return unescape(decodeURI(str));
  }
}

module.exports = {
  execute,
  requestProduct,
  requestToken,
};

const easyCodefConstant = require("./constant");
const easyCodefMsg = require("./messageconstant");
const easyCodefMsgGetResponse = easyCodefMsg.getResponseMessageConstant;
const request = require("request");
let easyCodefAcessToken = require("./accesstoken");

/**
 *  CODEF API 통신요청
 * @param properties
 * @param serviceType
 * @param productURL
 * @param param
 * @returns {Promise<unknown>}
 */
function execute(properties, serviceType, productURL, param) {
  /**
   * CODEF 상품 요청
   * @param token
   * @returns {Promise<unknown>}
   */
  let requestProduct = function (token) {
    return new Promise(function (resolve, reject) {
      let options = {
        url: properties.getProductRequestURL(serviceType, productURL),
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + token,
        },
      };

      request
        .post(options, (error, response, body) => {
          if (response) {
            resolve(response);
          }
          if (error) {
            reject(error);
          }
        })
        .write(encodeURIComponent(JSON.stringify(param)));
    });
  };

  /**
   *  CODEF 토큰 발급 > 상품 요청
   * @returns {Promise<{result: *, data: {}}|string|*>}
   */
  let productWorker = async function () {
    let token;

    for (let i = 0; i < easyCodefConstant.REPEAT_COUNT; i++) {
      try {
        token = await requestToken(serviceType, properties);
        break;
      } catch (e) {}
    }

    let response;
    try {
      response = await requestProduct(token);
    } catch (error) {
      response = error;
    }

    try {
      let bodyJSON = response.body
        ? decodeString(response.body)
        : response.body;

      let bodyError = JSON.parse(bodyJSON).error;
      if (bodyError) {
        if (bodyError == "invalid_token") {
          // 액세스 토큰 유효기간 만료시
          easyCodefAcessToken.setToken(serviceType, null);
          // 토큰 재 요청
          token = await requestToken(serviceType, properties);
          try {
            //+ 상품 재 요청.
            response = await requestProduct(token);
          } catch (error) {
            response = error;
          }
          bodyJSON = response.body
            ? decodeString(response.body)
            : response.body;
        }
      }

      // + 응답결과 처리
      if (response.statusCode == 200) {
        return bodyJSON;
      } else {
        switch (response.statusCode) {
          case 401:
            return easyCodefMsgGetResponse(
              easyCodefMsg.UNAUTHORIZED.CODE,
              easyCodefMsg.UNAUTHORIZED.MESSAGE
            );
            break;
          case 403:
            return easyCodefMsgGetResponse(
              easyCodefMsg.FORBIDDEN.CODE,
              easyCodefMsg.FORBIDDEN.MESSAGE
            );
            break;
          case 404: // HTTP Status-Code 404: Not Found.
            return easyCodefMsgGetResponse(
              easyCodefMsg.NOT_FOUND.CODE,
              easyCodefMsg.NOT_FOUND.MESSAGE
            );
            break;
          default:
            return easyCodefMsgGetResponse(
              easyCodefMsg.SERVER_ERROR.CODE,
              easyCodefMsg.SERVER_ERROR.MESSAGE
            );
        }
      }
    } catch (e) {
      return easyCodefMsgGetResponse(
        easyCodefMsg.LIBRARY_SENDER_ERROR.CODE,
        easyCodefMsg.LIBRARY_SENDER_ERROR.MESSAGE,
        e.message
      );
    }
  };

  return new Promise(function (resolve, reject) {
    if (!checkClientInfo(serviceType, properties)) {
      resolve(
        easyCodefMsgGetResponse(
          easyCodefMsg.EMPTY_CLIENT_INFO.CODE,
          easyCodefMsg.EMPTY_CLIENT_INFO.MESSAGE
        )
      );
      return;
    }
    // 2.필수 항목 체크 - 퍼블릭 키
    if (!checkPublicKey(properties)) {
      resolve(
        easyCodefMsgGetResponse(
          easyCodefMsg.EMPTY_PUBLIC_KEY.CODE,
          easyCodefMsg.EMPTY_PUBLIC_KEY.MESSAGE
        )
      );
      return;
    }
    //+ 3. 상품 요청 - 응답
    productWorker().then(function (response) {
      resolve(response);
    });
  });
}

module.exports.execute = execute;

/**
 *  토큰발급 요청
 * @param serviceType
 * @param properties
 * @returns {Promise<unknown>}
 */
function requestToken(serviceType, properties) {
  return new Promise(function (resolve, reject) {
    let clientID = easyCodefConstant.SANDBOX_CLIENT_ID;
    let clientSecret = easyCodefConstant.SANDBOX_CLIENT_SECRET;

    switch (serviceType) {
      case easyCodefConstant.SERVICE_TYPE_API: // 정식
        clientID = properties.CLIENT_ID;
        clientSecret = properties.CLIENT_SECRET;
        break;
      case easyCodefConstant.SERVICE_TYPE_DEMO: // 데모
        clientID = properties.DEMO_CLIENT_ID;
        clientSecret = properties.DEMO_CLIENT_SECRET;
        break;
    }

    let token = easyCodefAcessToken.getToken(serviceType);
    if (token) {
      resolve(token);
      return;
    }

    let options = {
      url: easyCodefConstant.OAUTH_DOMAIN + easyCodefConstant.GET_TOKEN,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(clientID + ":" + clientSecret).toString("base64"),
      },
    };

    request
      .post(options, (error, response, body) => {
        if (response) {
          if (response.statusCode == 200) {
            let token = JSON.parse(response.body).access_token;
            easyCodefAcessToken.setToken(serviceType, token);
            resolve(token);
          }
          reject(error);
        }
        if (error) {
          reject(error);
        }
      })
      .write("grant_type=client_credentials&scope=read");
  });
}
module.exports.requestToken = requestToken;

/**
 * 서비스 타입에 따른 클라이언트 정보 설정 확인
 * @returns {boolean}
 */
function checkClientInfo(serviceType, properties) {
  switch (serviceType) {
    case easyCodefConstant.SERVICE_TYPE_API: // 정식
      return properties.CLIENT_ID && properties.CLIENT_SECRET;
    case easyCodefConstant.SERVICE_TYPE_DEMO: // 데모
      return properties.DEMO_CLIENT_ID && properties.DEMO_CLIENT_SECRET;
    default:
      // 샌드박스
      return (
        easyCodefConstant.SANDBOX_CLIENT_ID &&
        easyCodefConstant.SANDBOX_CLIENT_SECRET
      );
  }
}

/**
 * PUBLIC_KEY 정보 설정 확인
 * @returns {boolean}
 */
function checkPublicKey(properties) {
  if (properties.PUBLIC_KEY) {
    return true;
  }
  return false;
}

/**
 *  서버 인코딩 응답 data 디코딩
 * @param str
 * @returns {string}
 */
function decodeString(str) {
  try {
    if (str.indexOf("+") > 0) {
      return decodeURIComponent(decodeURI(str).replace(/\+/g, " "));
    } else {
      return decodeURIComponent(decodeURI(str));
    }
  } catch (e) {
    return unescape(decodeURI(str));
  }
}

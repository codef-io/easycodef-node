module.exports = {
  OK: {
    CODE: 'CF-00000',
    MESSAGE: '성공',
  },
  INVALID_JSON: {
    CODE: 'CF-00002',
    MESSAGE: 'json형식이 올바르지 않습니다.',
  },
  INVALID_PARAMETER: {
    CODE: 'CF-00007',
    MESSAGE: '요청 파라미터가 올바르지 않습니다.',
  },
  UNSUPPORTED_ENCODING: {
    CODE: 'CF-00009',
    MESSAGE: '지원하지 않는 형식으로 인코딩된 문자열입니다.',
  },
  EMPTY_CLIENT_INFO: {
    CODE: 'CF-00014',
    MESSAGE:
      '상품 요청을 위해서는 클라이언트 정보가 필요합니다. 클라이언트 아이디와 시크릿 정보를 설정하세요.',
  },
  EMPTY_PUBLIC_KEY: {
    CODE: 'CF-00015',
    MESSAGE:
      '상품 요청을 위해서는 퍼블릭키가 필요합니다. 퍼블릭키 정보를 설정하세요.',
  },
  BAD_REQUEST: {
    CODE: 'CF-00400',
    MESSAGE: '클라이언트 요청 오류로 인해 요청을 처리 할 수 ​​없습니다.',
  },
  UNAUTHORIZED: {
    CODE: 'CF-00401',
    MESSAGE: '요청 권한이 없습니다.',
  },
  FORBIDDEN: {
    CODE: 'CF-00403',
    MESSAGE: '잘못된 요청입니다.',
  },
  NOT_FOUND: {
    CODE: 'CF-00404',
    MESSAGE: '요청하신 페이지(Resource)를 찾을 수 없습니다.',
  },
  METHOD_NOT_ALLOWED: {
    CODE: 'CF-00405',
    MESSAGE: '요청하신 방법(Method)이 잘못되었습니다.',
  },
  LIBRARY_SENDER_ERROR: {
    CODE: 'CF-09980',
    MESSAGE:
      '통신 요청에 실패했습니다. 응답정보를 확인하시고 올바른 요청을 시도하세요.',
  },
  SERVER_ERROR: {
    CODE: 'CF-09999',
    MESSAGE: '서버 처리중 에러가 발생 했습니다. 관리자에게 문의하세요.',
  },
};

function getResponseMessageConstant(errorInfo, extraMessage) {
  let result = {
    code: errorInfo.CODE,
    message: errorInfo.MESSAGE,
    extraMessage: extraMessage ? extraMessage : '',
  };
  return JSON.stringify({ result: result, data: {} });
}
module.exports.getResponseMessageConstant = getResponseMessageConstant;

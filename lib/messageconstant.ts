type ErrorInfo = {
  code: string;
  message: string;
};

function createMessageInfo(code: string, message: string): ErrorInfo {
  return { code, message };
}

export function getResponseMessageConstant(
  errorInfo: ErrorInfo,
  extraMessage?: string
): string {
  let result = {
    code: errorInfo.code,
    message: errorInfo.message,
    extraMessage: extraMessage ? extraMessage : '',
  };
  return JSON.stringify({ result: result, data: {} });
}

export const OK = createMessageInfo('CF-00000', '성공');
export const INVALID_JSON = createMessageInfo(
  'CF-00002',
  'json형식이 올바르지 않습니다.'
);
export const INVALID_PARAMETER = createMessageInfo(
  'CF-00007',
  '요청 파라미터가 올바르지 않습니다.'
);
export const UNSUPPORTED_ENCODING = createMessageInfo(
  'CF-00009',
  '지원하지 않는 형식으로 인코딩된 문자열입니다.'
);
export const EMPTY_CLIENT_INFO = createMessageInfo(
  'CF-00014',
  '상품 요청을 위해서는 클라이언트 정보가 필요합니다. 클라이언트 아이디와 시크릿 정보를 설정하세요.'
);
export const EMPTY_PUBLIC_KEY = createMessageInfo(
  'CF-00015',

  '상품 요청을 위해서는 퍼블릭키가 필요합니다. 퍼블릭키 정보를 설정하세요.'
);
export const BAD_REQUEST = createMessageInfo(
  'CF-00400',
  '클라이언트 요청 오류로 인해 요청을 처리 할 수 ​​없습니다.'
);
export const UNAUTHORIZED = createMessageInfo(
  'CF-00401',
  '요청 권한이 없습니다.'
);
export const FORBIDDEN = createMessageInfo('CF-00403', '잘못된 요청입니다.');
export const NOT_FOUND = createMessageInfo(
  'CF-00404',
  '요청하신 페이지(Resource)를 찾을 수 없습니다.'
);
export const METHOD_NOT_ALLOWED = createMessageInfo(
  'CF-00405',
  '요청하신 방법(Method)이 잘못되었습니다.'
);
export const INVALID_2WAY_INFO = createMessageInfo(
  'CF-03003',
  '2WAY 요청 처리를 위한 정보가 올바르지 않습니다. 응답으로 받은 항목을 그대로 2way요청 항목에 포함해야 합니다.'
);
export const LIBRARY_SENDER_ERROR = createMessageInfo(
  'CF-09980',
  '통신 요청에 실패했습니다. 응답정보를 확인하시고 올바른 요청을 시도하세요.'
);
export const SERVER_ERROR = createMessageInfo(
  'CF-09999',
  '서버 처리중 에러가 발생 했습니다. 관리자에게 문의하세요.'
);

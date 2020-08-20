/************************************************************************************************************
 *  코드에프 게정 정보
 ************************************************************************************************************/

/**	OAUTH 서버 도메인	*/
export const OAUTH_DOMAIN = 'https://oauth.codef.io';

/**	OAUTH 엑세스 토큰 발급 URL PATH	*/
export const GET_TOKEN = '/oauth/token';

/**   토큰발급 재시도 3회  **/
export const REPEAT_COUNT = 3;

/**    정식 서버 도메인    */
export const API_DOMAIN = 'https://api.codef.io';

/**	데모 서버 도메인	*/
export const DEMO_DOMAIN = 'https://development.codef.io';

/**	샌드박스 서버 도메인	*/
export const SANDBOX_DOMAIN = 'https://sandbox.codef.io';
export const SANDBOX_CLIENT_ID = 'ef27cfaa-10c1-4470-adac-60ba476273f9';
export const SANDBOX_CLIENT_SECRET = '83160c33-9045-4915-86d8-809473cdf5c3';

/************************************************************************************************************
 *  코드에프 응답 코드
 *************************************************************************************************************/

/** 응답부 수행 결과 키워드	*/
export const RESULT = 'result';

/** 응답부 수행 결과 메시지 코드 키워드	*/
export const CODE = 'code';

/** 응답부 수행 결과 메시지 키워드	*/
export const MESSAGE = 'message';

/** 응답부 수행 결과 추가 메시지 키워드	*/
export const EXTRA_MESSAGE = 'extraMessage';

/**	응답부 수행 결과 데이터 키워드	*/
export const DATA = 'data';

/**	엑세스 토큰 거절 사유1	*/
export const INVALID_TOKEN = 'invalid_token';

/**	엑세스 토큰 거절 사유2	*/
export const ACCESS_DENIED = 'access_denied';

/************************************************************************************************************
 *     코드에프 서비스 타입(0:정식, 1:데모, 2:샌드박스)
 *************************************************************************************************************/
export type ServiceType = number;
export const SERVICE_TYPE_API: ServiceType = 0; // 정식
export const SERVICE_TYPE_DEMO: ServiceType = 1; // 데모
export const SERVICE_TYPE_SANDBOX: ServiceType = 2; // 샌드박스

/************************************************************************************************************
 *  코드에프 상품 URL 정보
 *************************************************************************************************************/
// /**	요청 상품 주소	*/
// PRODUCT_URL: "",

/**	커넥티드 아이디 목록 조회 URL	*/
export const GET_CID_LIST = '/v1/account/connectedId-list';

/**	계정 목록 조회 URL	*/
export const GET_ACCOUNT_LIST = '/v1/account/list';

/**	계정 등록 URL	*/
export const CREATE_ACCOUNT = '/v1/account/create';

/**	계정 추가 URL	*/
export const ADD_ACCOUNT = '/v1/account/add';

/**	계정 수정 URL	*/
export const UPDATE_ACCOUNT = '/v1/account/update';

/**	계정 삭제 URL	*/
export const DELETE_ACCOUNT = '/v1/account/delete';

export default {
  OAUTH_DOMAIN,
  GET_TOKEN,
  REPEAT_COUNT,
  API_DOMAIN,
  DEMO_DOMAIN,
  SANDBOX_DOMAIN,
  SANDBOX_CLIENT_ID,
  SANDBOX_CLIENT_SECRET,
  RESULT,
  CODE,
  MESSAGE,
  EXTRA_MESSAGE,
  DATA,
  INVALID_TOKEN,
  ACCESS_DENIED,
  SERVICE_TYPE_API,
  SERVICE_TYPE_DEMO,
  SERVICE_TYPE_SANDBOX,
  GET_CID_LIST,
  GET_ACCOUNT_LIST,
  CREATE_ACCOUNT,
  ADD_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
};

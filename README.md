

# Overview

CODEF는 온라인에 흩어진 데이터를 클라이언트 엔진과 웹 API 등을 활용해 쉽고 빠르게 사용할 수 있도록 돕습니다. 아이디어가 구현되기 위한 복잡한 과정을 간결하게 바꾸고, 수고로움을 줄이고자 노력합니다. 

[홈페이지](https://codef.io/)  
[개발가이드](https://developer.codef.io/)  
[블로그](https://blog.hectodata.co.kr/)  



`easycodef-node`는 CODEF API 연동 개발을 돕는 라이브러리 유틸입니다.  
사용을 위해서는 [홈페이지](https://codef.io/) 가입 후 데모/정식 서비스 신청을 통해 자격 증명을 위한 클라이언트 정보 등을 발급받아야 하며 사용 가능한 모든 API의 엔드포인트(은행, 카드, 보험, 증권, 공공, 기타)와 요청/응답 항목은 모두 [개발가이드](https://developer.codef.io/)를 통해 확인할 수 있습니다.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/codef-io/easycodef-node/blob/master/LICENSE)
![Node version](https://img.shields.io/badge/node-%3E%3D%20v7.6.0-brightgreen)

# Get it!
  
Using npm:

```bash
$ npm i easycodef-node
```


# Use it!

## Quik Start
아래 가이드는 [easycodef-node-exam](https://github.com/codef-io/easycodef-node-exam)을 기반으로 작성되었으며 샌드박스 서버를 대상으로 즉시 테스트가 가능합니다.

> **샌드박스에서는 필수 요청 파라미터 여부를 체크한 뒤 요청 상품에 따른 예정되어 있는 고정 응답 값을 반환합니다.**  
> **사용자는 샌드박스를 통해 코드에프 연동에 대한 개발 연습과 상품 별 응답 자료 구조 등을 확인 할 수 있습니다.**

## 1. 토큰 요청

CODEF API 서비스를 이용하기 위해서는 서비스 이용에 대한 자격 증명을 통해 토큰을 발급받아야 합니다. 토큰은 모든 요청시 헤더 값에 포함되어야 하며 한번 발급 받은 토큰은 일주일간 재사용이 가능합니다. 

> **easycodef-node 라이브러리는 토큰의 발급과 재사용을 자동으로 처리합니다.**  
> **재사용 중인 토큰의 유효기간이 만료되는 경우 재발급 또한 자동으로 처리됩니다.**

사용자는 단순히 자격증명을 위한 **클라이언트 정보** 설정 만을 진행하면 됩니다.  아래의 예제는 사용자가 직접 토큰을 발급받는 과정을 설명합니다. 계정 관리나 상품 요청시 토큰은 라이브러리 내에서 자동 발급받아 사용하기 때문에 특별한 경우가 아니라면 사용자가 직접 토큰을 요청할 필요는 없습니다.

```node
//코드에프 가입을 통해 발급 받은 클라이언트 정보 - 데모
const DEMO_CLIENT_ID = '';
const DEMO_CLIENT_SECRET = '';

// 코드에프 가입을 통해 발급 받은 클라이언트 정보- 정식
const CLIENT_ID = '';
const CLIENT_SECRET = '';

//	코드에프 가입을 통해 발급 받은 RSA 공개키 정보
const PUBLIC_KEY = '';

/*
 *#1.쉬운 코드에프 객체 생성
 */
const codef = new EasyCodef();

/*
 *#2.RSA암호화를 위한 퍼블릭키 설정
 * - 데모/정식 서비스 가입 후 코드에프 홈페이지에 확인 가능(https://codef.io/#/account/keys)
 * - 암호화가 필요한 필드에 사용 - encryptValue(String plainText);
 */
codef.setPublicKey(PUBLIC_KEY);

/*
 *#3.데모 클라이언트 정보 설정
 * - 데모 서비스 가입 후 코드에프 홈페이지에 확인 가능(https://codef.io/#/account/keys)
 * - 데모 서비스로 상품 조회 요청시 필수 입력 항목
 */
codef.setClientInfoForDemo(DEMO_CLIENT_ID, DEMO_CLIENT_SECRET);

/*
 * #4.정식 클라이언트 정보 설정
 * - 정식 서비스 가입 후 코드에프 홈페이지에 확인 가능(https://codef.io/#/account/keys)
 * - 정식 서비스로 상품 조회 요청시 필수 입력 항목
 */
codef.setClientInfo(CLIENT_ID, CLIENT_SECRET);

/*#5.요청
 *  - 샌드박스 : EasyCodefConstant.SERVICE_TYPE_SANDBOX
 *  - 데모 : EasyCodefConstant.SERVICE_TYPE_DEMO
 *  - 운영 : EasyCodefConstant.SERVICE_TYPE_API
 */
codef
  .requestToken(EasyCodefConstant.SERVICE_TYPE_SANDBOX)
  .then(function (response) {
    /*
     * #6. 토큰 발급 결과
     */
    console.log(response);
  });
```


## 2. 계정 관리

CODEF API 서비스의 여러 상품들 중 요청 파라미터에 Connected ID가 필요한 경우가 있습니다. 인증이 필요한 CODEF API를 사용하기 위해서는 엔드 유저(End User) 계정 정보(대상기관의 인증수단)등록이 필요하며, 이를 통해 사용자마다 다른 Connected ID를 발급받을 수 있습니다. (Connected ID는 [개발가이드 인증방식](https://developer.codef.io/common-guide/connected-id/cid)에서 자세한 내용을 확인하세요.) 

Connected ID 발급 이후에는 직접적인 계정 정보 전송 없이 대상기관의 데이터를 요청할 수 있습니다. Connected ID는 계정 등록 요청 시 발급되며 이후 계정 추가/계정 수정/계정 삭제 요청으로 관리할 수 있습니다. 동일한 기관의 동일한 계정 정보는 중복해서 등록할 수 없으며 개인 고객/기업 고객 각각 1개씩 등록이 가능합니다.

모든 상품의 파라미터에 Connected ID가 필요한 것은 아닙니다. 상품별 파라미터는 [개발가이드 상품안내](https://developer.codef.io/products/bank/overview)에서 확인할 수 있습니다.

> **Connected ID를 사용하지 않는 API를 사용하는 경우 계정 관리는 생략하세요.**

```node
const {
  EasyCodef,
  EasyCodefConstant,
  EasyCodefUtil,
} = require('easycodef-node');
const path = require('path');

// 쉬운 코드에프 객체 생성 및 클라이언트 정보, 퍼블릭키 설정에 관한 #1~#4 단계는 생략.

/*
 * #5.요청 파라미터 설정
 * - 계정관리 파라미터를 설정(https://developer.codef.io/cert/account/cid-overview)
 */
const accountList = []; // 계정 등록 리스트

//+[인증서]
const accountCert = {
  countryCode: 'KR',
  businessType: 'BK',
  clientType: 'P',
  organization: '0004',
  loginType: '0',
  certType: '1',
  keyFile: EasyCodefUtil.encodeToFileString(
    path.join(__dirname, 'signPri.key')
  ),
  derFile: EasyCodefUtil.encodeToFileString(
    path.join(__dirname, 'signCert.der')
  ),
  password: EasyCodefUtil.encryptRSA(PUBLIC_KEY, 'user_password')
};
accountList.push(accountCert);

//+ [아이디]
const accountIDPWD = {
  countryCode: 'KR',
  businessType: 'BK',
  clientType: 'P',
  organization: '0081',
  loginType: '1',
  id: 'user_id',
  password: EasyCodefUtil.encryptRSA(PUBLIC_KEY, 'user_password')
};
accountList.push(accountIDPWD);

const param = {
  accountList: accountList,
};

/*	#6.요청
 *  [서비스 타입 설정]
 *      - 샌드박스 : EasyCodefConstant.SERVICE_TYPE_SANDBOX
 *      - 데모 : EasyCodefConstant.SERVICE_TYPE_DEMO
 *      - 운영 : EasyCodefConstant.SERVICE_TYPE_API
 */
codef
  .createAccount(EasyCodefConstant.SERVICE_TYPE_SANDBOX, param)
  .then(function (response) {
    /*
     *  #7. 응답 결과
     */
    console.log(response);
  });


```
계정 등록 요청은 등록하려는 여러 기관의 계정을 목록 파라미터로 설정해 한번에 요청이 가능하며 응답 결과는 아래와 같습니다. 사용자는 발급받은 Connected ID를 계정 등록에 성공한 기관(successList) 상품 조회 요청시 사용을 할 수 있습니다.

> 예) 우리카드(0309)으로 등록한 Connected ID를 KB카드(0301) 상품 조회시 사용할 수 없음

```json
{
  "result" : {
    "code" : "CF-00000",
    "extraMessage" : "",
    "message" : "정상",
    "transactionId":"786e01e459af491888e1f782d1902e40"
  },
  "data" : {
    "successList" : [ {
      "code" : "CF-00000",    
      "message" : "정상",
      "extraMessage" : "",            
      "countryCode" : "KR",      
      "businessType" : "CD",      
      "clientType" : "P",
      "loginType" : "1",
      "organization" : "0309"
    }],
    "errorList" : [ ],
    "connectedId" : "byi1wYwD40k8hEIiXl6bRF"
  }
}
```
계정 등록 이외의 계정 추가, 수정, 삭제 등의 계정 관리 기능과 계정 목록 조회, Connected ID 목록 조회 등 조회 기능은 `easycodef-node-exam`에서 확인 할 수 있습니다. 

인증서로 계정을 등록하는 경우에는 cert파일, key파일 세트 혹은 pfx파일 2가지 모두를 지원합니다. [개발가이드 계정등록](https://developer.codef.io/common-guide/connected-id/register)에서 자세한 내용을 확인하세요. 인증서 내보내기/가져오기 등 인증서 릴레이 서버 기능이 필요한 경우 <support@codef.io>로 문의해주시기 바랍니다. 코드에프에서는 계정 관리를 위한 인증서 팝업과 전송 서버를 서비스 하고 있습니다.

![코드에프 인증서 릴레이 서비스](https://download.codef.io/codef/github/codef-relay-server01.png)


## 3. 상품 요청

엔드 유저의 계정 등록 과정을 거쳐 상품 사용 준비가 끝났다면 이제 발급받은 Connected ID와 필요한 파라미터 정보 설정 등을 통해 코드에프 API 상품 요청을 할 수 있습니다.  Connected ID를 사용하는 상품과 Connected ID를 사용하지 않는 상품 요청 예제를 아래 코드를 통해 
확인하겠습니다.

> **한번 더 강조하자면 모든 상품의 파라미터에 Connected ID가 필요한 것은 아닙니다.**  
> **상품별 파라미터는 [개발가이드 상품안내](https://developer.codef.io/products/bank/overview)에서 확인할 수 있습니다.** 

#### - 일반 상품
```node
// 개인 보유카드 조회(Connected ID 사용)

//#1 ~ #4 쉬운 코드에프 객체 생성
const codef = new EasyCodef();
codef.setPublicKey(PUBLIC_KEY);
codef.setClientInfoForDemo(DEMO_CLIENT_ID, DEMO_CLIENT_SECRET);
codef.setClientInfo(CLIENT_ID, CLIENT_SECRET);

/* #5.요청 파라미터 설정 - 각 상품별 파라미터를 설정(https://developer.codef.io/products) */
let param = {
  connectedId: '9GNB80TmkzNaX-E7zG....',
  organization: '0309',
  birthDate : '',
  inquiryType: '0'
};

/* #6.코드에프 정보 조회 요청 - 서비스타입(API:정식, DEMO:데모, SANDBOX:샌드박스) */
const productUrl = '/v1/kr/card/p/account/card-list'; // (예시)개인 보유카드 조회 URL
codef
  .requestProduct(productUrl, EasyCodefConstant.SERVICE_TYPE_SANDBOX, param)
  .then(function (response) {
    // #7. 응답 결과
    console.log(response);
  });
```

쉬운 코드에프 객체 생성 후 클라이언트 정보 등을 설정한 다음 개인 보유카드 조회를 위한 파라미터를 설정해서 상품 요청을 합니다. 라이브러리 사용자는 토큰 발급이나 토큰 관리, 요청 파라미터의 인코딩, 응답 바디의 디코딩 등 API이용을 위한 부수적인 작업을 직접 할 필요가 없습니다. 상품 요청에 필요한 파라미터를 설정하고 requestProduct 메서드 호출만으로 Connected ID로 등록된 계정의 기관(0309 우리카드)의 보유카드 목록을 아래와 같이 응답받게 됩니다.

```json
{
  "result" : {
    "code" : "CF-00000",
    "extraMessage" : "",
    "message" : "성공",
    "transactionId" : "5069429e367745baba92f5c12c4343de"
  },
  "data" : [ {
    "resCardType" : "체크/본인",
    "resValidPeriod" : "",
    "resCardName" : "OO체크카드-국제ATM",
    "resTrafficYN" : "불가능",
    "resIssueDate" : "",
    "resUserNm" : "***",
    "resSleepYN" : "",
    "resCardNo" : "6056********0000"
  }, {
    "resCardType" : "신용/본인",
    "resValidPeriod" : "",
    "resCardName" : "할인카드",
    "resTrafficYN" : "불가능",
    "resIssueDate" : "",
    "resUserNm" : "***",
    "resSleepYN" : "",
    "resCardNo" : "6253********0000"
  }, {
    "resCardType" : "체크/본인",
    "resValidPeriod" : "",
    "resCardName" : "OO체크카드",
    "resTrafficYN" : "불가능",
    "resIssueDate" : "",
    "resUserNm" : "***",
    "resSleepYN" : "",
    "resCardNo" : "4214********0000"
  } ]
}
```

이번에는 사업자 휴폐업 상태 정보를 조회하는 상품의 예제입니다.

```node
// 사업자등록상태(휴폐업조회)(Connected ID 미사용)

//#1 ~ #4 쉬운 코드에프 객체 생성
const codef = new EasyCodef();
codef.setPublicKey(PUBLIC_KEY);
codef.setClientInfoForDemo(DEMO_CLIENT_ID, DEMO_CLIENT_SECRET);
codef.setClientInfo(CLIENT_ID, CLIENT_SECRET);

/* #5.요청 파라미터 설정 - 각 상품별 파라미터를 설정(https://developer.codef.io/products) */

const reqIdentityList = [];

const identity1 = {
  reqIdentity: '3333344444',
};
reqIdentityList.push(identity1);

const identity2 = {
  reqIdentity: '1234567890',
};
reqIdentityList.push(identity2);

/*
 * #5.요청 파라미터 설정
 */
let param = {
  organization: '0004',
  reqIdentityList: reqIdentityList,
};

const productUrl = '/v1/kr/public/nt/business/status'; // (예시)사업자등록상태(휴폐업조회) URL

/*	#6.요청
 *  [서비스 타입 설정]
 *      - 샌드박스 : EasyCodefConstant.SERVICE_TYPE_SANDBOX
 *      - 데모 : EasyCodefConstant.SERVICE_TYPE_DEMO
 *      - 운영 : EasyCodefConstant.SERVICE_TYPE_API
 */
codef
  .requestProduct(productUrl, EasyCodefConstant.SERVICE_TYPE_SANDBOX, param)
  .then(function (response) {
    /*
     *  #7. 응답 결과
     */
    console.log(response);
  });

```

2개의 상폼 요청 예시를 비교해 코드의 내용을 살펴보면 개인 보유카드 조회와 사업자등록상태 조회의 차이는 **요청주소(URL)와 파라미터 설정**에만 있는 것을 확인할 수 있습니다.  사용자는 라이브러리 사용을 통해 일관된 형태의 코드를 작성하여 개발할 수 있고 다른 사람이 작성한 상품 요청 코드를 쉽게 이해할 수 있습니다.

```json
{
  "result" : {
    "code" : "CF-00000",
    "extraMessage" : "",
    "message" : "성공",
    "transactionId" : "786e01e459af491888e1f782d1902e40"
  },
  "data" : [ {
    "resBusinessStatus" : "사업을하지않고있습니다.",
    "resCompanyIdentityNo" : "3333344444",
    "code" : "CF-00000",
    "resTaxationTypeCode" : "98",
    "extraMessage" : null,
    "resClosingDate" : "",
    "resTransferTaxTypeDate" : "",
    "message" : "성공"
  }, {
    "resBusinessStatus" : "부가가치세일반과세자입니다.\n*과세유형전환된날짜는2011년07월01일입니다.",
    "resCompanyIdentityNo" : "1234567890",
    "code" : "CF-00000",
    "resTaxationTypeCode" : "1",
    "extraMessage" : null,
    "resClosingDate" : "",
    "resTransferTaxTypeDate" : "20110701",
    "message" : "성공"
  } ]
}
```

#### - 추가 인증 상품

추가 인증 상품이란 API호출 한번으로 요청 결과를 받을 수 있는 일반 상품과는 달리 첫 요청 이후 대상기관이 요구하는 추가 인증(이메일, SMS,  보안문자 입력 등)을 수행해야 요청 결과를 받을 수 있는 상품을 의미합니다. 

예를 들어 아래 그림과 같이 로그인을 하는 경우 아이디와 비밀번호 외에 대상기관에서 추가적으로 요구하는 보안문자 입력이 진행되어야 합니다. 고정 값인 아이디, 비밀번호와 다르게 보안문자 이미지는 랜덤하게 반환되기 때문에 엔드 유저의 추가적인 정보 입력이 필요합니다. 

![보안문자입력 예시](https://download.codef.io/codef/github/recaptcha.png)

대상기관이 요구하는 인증방식에 따라 N차 추가인증이 요구 될 수 있으며, 추가 인증 정보 입력이 진행되어야 정상적으로 CODEF API 요청도 완료됩니다.  1차 입력부[기본파라미터] -> n차 추가 인증[기본 파라미터 + 추가 인증 파라미터] 요청으로 이루어집니다. **추가 인증은 사용자 인증을 위한 정보가 대부분**이며 추가 인증 요청시에도 Endpoint URL은 동일합니다. 

> **샌드박스 서버를 통해 추가인증 상품에 대한 테스트를 진행 할 수는 없습니다.**

추가 인증에 필요한 파라미터 설명은 개발 가이드의 각 상품  페이지에서 확인할 수 있으며 자세한 내용은 [개발가이드 추가인증](https://developer.codef.io/common-guide/add-auth)을 통해 확인하세요.

# Ask us

easycodef-node 라이브러리 사용에 대한 문의사항과 개발 과정에서의 오류 등에 대한 문의를 [홈페이지 문의게시판](https://codef.io/#/cs/inquiry)에 올려주시면 운영팀이 답변을 드립니다. 문의게시판의 작성 양식에 맞춰 문의 글을 남겨주세요. 가능한 빠르게 응답을 드리겠습니다.

/**
 *  서비스 별 토큰 관리 클래스
 */
let accesstoken = new Map();
let tokenmap = {
  setToken: function (serviceType, accessToken) {
    accesstoken.set(serviceType, accessToken);
  },
  getToken: function (serviceType) {
    return accesstoken.get(serviceType);
  },
};
module.exports = tokenmap;

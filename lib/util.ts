import crypto from 'crypto';
import fs from 'fs';
import constants from 'constants';

/**
 * RSA 암호화
 * @param plainText
 * @returns {*}
 */
export function encryptRSA(publicKey: string, plainText: string): string {
  let bufferToEncrypt = Buffer.from(plainText);
  return crypto
    .publicEncrypt(
      {
        key:
          '-----BEGIN PUBLIC KEY-----\n' +
          publicKey +
          '\n-----END PUBLIC KEY-----',
        padding: constants.RSA_PKCS1_PADDING,
      },
      bufferToEncrypt
    )
    .toString('base64');
}
/**
 *  byte배열로 추출한 파일 정보를 BASE64 문자열로 인코딩
 * @param filePath
 * @returns {string}
 */
export function encodeToFileString(filePath: string): Promise<string> {
  return new Promise((resolve, rejects) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err) {
        rejects(err);
      }

      resolve(buffer.toString('base64'));
    });
  });
}

export default {
  encryptRSA,
  encodeToFileString,
};

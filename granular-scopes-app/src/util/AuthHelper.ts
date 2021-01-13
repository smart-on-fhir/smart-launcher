/// Based on code from https://github.com/BitySA/oauth2-auth-code-pkce

  export interface PKCECodes {
    codeChallenge: string;
    codeVerifier: string;
  }

  /**
 * The maximum length for a code verifier for the best security we can offer.
 * Please note the NOTE section of RFC 7636 § 4.1 - the length must be >= 43,
 * but <= 128, **after** base64 url encoding. This means 32 code verifier bytes
 * encoded will be 43 bytes, or 96 bytes encoded will be 128 bytes. So 96 bytes
 * is the highest valid value that can be used.
 */
export const RECOMMENDED_CODE_VERIFIER_LENGTH = 96;

/**
 * Character set to generate code verifier defined in rfc7636.
 */
const PKCE_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

export class AuthHelper {
  
    /**
   * Implements *base64url-encode* (RFC 4648 § 5) without padding, which is NOT
   * the same as regular base64 encoding.
   */
  static base64urlEncode(value: string): string {
    let base64 = btoa(value);
    base64 = base64.replace(/\+/g, '-');
    base64 = base64.replace(/\//g, '_');
    base64 = base64.replace(/=/g, '');
    return base64;
  }
    
  /**
   * Generates a code_verifier and code_challenge, as specified in rfc7636.
   */
  static generatePKCECodes(): PromiseLike<PKCECodes> {
    const output = new Uint32Array(RECOMMENDED_CODE_VERIFIER_LENGTH);
    crypto.getRandomValues(output);
    const codeVerifier = this.base64urlEncode(Array
      .from(output)
      .map((num: number) => PKCE_CHARSET[num % PKCE_CHARSET.length])
      .join(''));

    return crypto
      .subtle
      .digest('SHA-256', (new TextEncoder()).encode(codeVerifier))
      .then((buffer: ArrayBuffer) => {
        let hash = new Uint8Array(buffer);
        let binary = '';
        let hashLength = hash.byteLength;
        for (let i: number = 0; i < hashLength; i++) {
          binary += String.fromCharCode(hash[i]);
        }
        return binary;
      })
      .then(this.base64urlEncode)
      .then((codeChallenge: string) => ({ codeChallenge, codeVerifier }));
  }
}
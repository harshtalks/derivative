/**
 * @name toStringFromUint
 * @description convert a Uint8Array to a string
 * @param uint8array {Uint8Array}
 * @returns
 */

export const toStringFromUint = (uint8array: Uint8Array) => {
  /**
   * @description Here we have used base64url encoding to convert the Uint8Array to a string
   * @see https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
   */
  return Buffer.from(uint8array).toString("base64url");
};

/**
 * @name toUintFromStr
 * @description convert a string to a Uint8Array
 * @param str {string}
 * @returns
 */

export const toUintFromStr = (str: string) => {
  /**
   * @description Here we have used base64url decoding to convert the string to a Uint8Array
   * @see https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
   */
  return new Uint8Array(Buffer.from(str, "base64url"));
};

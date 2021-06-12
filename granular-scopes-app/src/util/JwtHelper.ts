
export class JwtHelper {

  static decodeToken(token:string):string[] {
    return String(token || '').split('.').map(data => {
      try {
          return JSON.parse(atob(data));
      }
      catch(ex) {
          return data;
      }
    });
  }

  static getDecodedTokenString(token?:string):string {
    if (!token) {
      return 'No Token Found';
    }

    return JwtHelper.decodeToken(token).map((part) => JSON.stringify(part, null, 2)).join('\n.\n');
  }
}
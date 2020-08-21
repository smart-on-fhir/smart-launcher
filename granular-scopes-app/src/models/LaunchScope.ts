
export class LaunchScope extends Map<string, boolean> {
  getScopes():string {
    let scopeString:string = '';

    this.forEach((value:boolean, key: string) => {
      if (value === false) {
        return;
      }

      if (scopeString === '') {
        scopeString = key;
      } else {
        scopeString += ' ' + key;
      }
    });

    return scopeString;
  }

  save(scopeSetName:string) {
    sessionStorage.setItem(scopeSetName, this.getScopes());
  }

  load(scopeSetName:string, allowNewScopes:boolean) {
    let scopes:string = sessionStorage.getItem(scopeSetName) ?? '';

    if (scopes !== '') {
      this.loadFromScopes(scopes, allowNewScopes);
    }
  }

  loadFromScopes(scopes:string, allowNewScopes:boolean) {
    let saved:Map<string, boolean> = new Map();

    let split:string[] = scopes.split(' ');
    split.forEach((val:string) => {
      saved.set(val, true);
    })

    for (let key of this.keys()) {
      if (saved.has(key)) {
        this.set(key, true);
      } else {
        this.set(key, false);
      }
    }

    if (allowNewScopes) {
      for (let key of saved.keys()) {
        this.set(key, true);
      }
    }
  }
};
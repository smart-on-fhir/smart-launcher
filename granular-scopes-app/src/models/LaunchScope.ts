
export interface ScopeComparison {
  granted:string[];
  denied:string[];
}

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

  buildScopeString(prefix?:string, joiner?:string, suffix?:string, onlyGranted?:boolean, onlyDenied?:boolean):string {
    if (this.size === 0) {
      return '';
    }

    let scopeString:string = prefix ?? '';

    let first:boolean = true;
    this.forEach((value:boolean, key:string) => {
      if ((onlyGranted) && (!value)) {
        return;
      }

      if ((onlyDenied) && (value)) {
        return;
      }

      if (first) {
        first = false;
      } else {
        scopeString += joiner ?? ' ';
      }

      scopeString += key;
    });

    scopeString += suffix ?? '';

    return scopeString;
  }

  save(scopeSetName:string) {
    sessionStorage.setItem(scopeSetName, JSON.stringify(Array.from(this.entries())));
  }

  static load(scopeSetName:string):LaunchScope {
    let val:string = sessionStorage.getItem(scopeSetName) ?? '';

    if (!val) {
      return new LaunchScope();
    }

    let loaded:LaunchScope = new LaunchScope(JSON.parse(val) ?? []);
    return loaded;
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

  compareToGranted(scopes:string):ScopeComparison {
    let granted:string[] = [];
    let denied:string[] = [];

    this.forEach((requested:boolean, key:string) => {
      if (!requested) {
        return;
      }

      if (scopes.indexOf(key) === -1) {
        denied.push(key);
      } else {
        granted.push(key);
      }
    });

    return {
      granted: granted,
      denied: denied,
    }
  }
};
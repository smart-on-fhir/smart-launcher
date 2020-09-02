class GranularHelper {
  static addOpIfPresent(operations, opMap, opName, params) {
    if (operations.indexOf(opName) === -1) {
      return;
    } 

    if (!opMap.has(opName)) {
      opMap.set(opName, []);
    }

    if (!params) {
      return;
    }

    let existingParams = opMap.get(opName);
    existingParams.push(params);

    opMap.set(opName, existingParams);
  }

  static addOperationInfo(resourceScopePart, opMap) {
    let paramDelim = resourceScopePart.indexOf('?');
    let operations = '';
    let parameters = '';

    if (paramDelim === -1) {
      operations = resourceScopePart;
    } else {
      operations = resourceScopePart.substr(0, paramDelim);
      parameters = resourceScopePart.substr(paramDelim + 1);
    }

    switch (operations) {
      case 'read':
      case 'write':
      case '*':
        return false;
    }

    this.addOpIfPresent(operations, opMap, 'c', parameters);
    this.addOpIfPresent(operations, opMap, 'r', parameters);
    this.addOpIfPresent(operations, opMap, 'u', parameters);
    this.addOpIfPresent(operations, opMap, 'd', parameters);
    this.addOpIfPresent(operations, opMap, 's', parameters);

    return true;
  }

  static getScopeMap(token) {
    if ((!token) || (!token.scope)) {
      return null;
    }

    let scopes = new Map();
    let useGranular = false;

    let scopeArray = token.scope.split(' ');
    scopeArray.forEach((scope) => {
        let slashIndex = scope.indexOf('/');
        if (slashIndex === -1) {
            return;
        }

        let parts = [scope.substr(0, slashIndex), scope.substr(slashIndex+1)];
        let resourceName = null;

        switch (parts[0]) {
            case 'launch':
              resourceName = parts[1].substr(0, 1).toUpperCase() + parts[1].substr(1);
                if (!scopes.has(resourceName)) {
                  let launchResourceMap = new Map();
                  launchResourceMap.set('r', []);

                  scopes.set(resourceName, launchResourceMap);
                }
              break;

            case 'patient':
              let resourceDelim = parts[1].indexOf('.');
              resourceName = parts[1].substr(0, resourceDelim);
              if (!scopes.has(resourceName)) {
                  scopes.set(resourceName, new Map());
              }

              let opMap = scopes.get(resourceName);

              if (this.addOperationInfo(parts[1].substr(resourceDelim + 1), opMap)) {
                useGranular = true;
              }
              
              scopes.set(resourceName, opMap);
              break;
        }
    });

    if (useGranular) {
      return scopes;
    }

    return null;
  }

}

module.exports = GranularHelper;
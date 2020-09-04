class GranularHelper {
  static logGranularScopes(granularScopes) {
    console.log('--- Granular Scopes ---');
    for (var resource in granularScopes) {
      if (!Object.prototype.hasOwnProperty.call(granularScopes, resource)) {
        continue;
      }

      console.log(' /' + resource);

      for (var op in granularScopes[resource]) {
        if (!Object.prototype.hasOwnProperty.call(granularScopes[resource], op)) {
          continue;
        }
  
        if (granularScopes[resource][op].length > 0) {
          console.log('   .' + op + ':');

          if (this.isOpenInteraction(granularScopes[resource][op])) {
            console.log('      *');
            continue;
          }

          granularScopes[resource][op].forEach((filterGroup) => {
            let msg = '      ';
            filterGroup.forEach((filter, filterIndex) => {
              if (filterIndex !== 0) {
                msg += ' && ';
              }

              msg += filter.field + '=';

              if (filter.props.length > 1) {
                msg += '(';
              }

              filter.props.forEach((prop, propIndex) => {
                if (propIndex !== 0) {
                  msg += ' || ';
                }
                if ((prop.system) && (prop.system !== '*')) {
                  msg += prop.system + '|';
                }

                msg += prop.code;
              });
               
              if (filter.props.length > 1) {
                msg += ')';
              }
            });

            console.log(msg);
          });
        }
      }
    }
    console.log('--- Granular Scopes ---');
  }

  static doParamsPass(type, id, method, searchParams, granularScopes) {
    if (!type) {
      return false;
    } 

    if (!granularScopes[type]) {
      return false;
    }

    let interaction;

    // determine the operation (interaction) from the HTTP verb
    switch (method) {
      case 'GET':
        if (id) {
          interaction = 'r';
        } else {
          interaction = 's';
        }
        break;

      case 'POST':
        if (id === '_search') {
          interaction = 'r';
          id = '';
        } else {
          interaction = 'c';
        }

        break;

      case 'PUT':
        interaction = 'u';
        break;

      case 'DELETE':
        interaction = 'd';
        break;
    }

    // unknown / unsupported operation
    if (!interaction) {
      return false;
    }

    // deny if we don't have this operation in scope
    if (!granularScopes[type][interaction]) {
      return false;
    }

    // return if we have unrestricted access to this operation
    if (this.isOpenInteraction(granularScopes[type][interaction])) {
      return true;
    }

    // otherwise allow operations we're not checking yet
    switch (interaction) {
      case 'c':
      case 'u':
      case 'd':
        return true;

      case 'r':
        // console.log('Attempting read on:', type, 'id:', id);

        for (const filterGroup of granularScopes[type][interaction]) {
          for (const filter of filterGroup) {
            // console.log(' checking filter field:', filter.field);

            if (filter.field !== '_id') {
              continue;
            }

            for (const prop of filter.props) {
              if (prop.code === id) {
                return true;
              }
            }
          }
        }

        return false;
    }

    // deny if we have no parameters at this point
    if (!searchParams) {
      return false;
    }

    // console.log('\n');
    // console.log('Checking interaction:', interaction)
    // console.log('Search parameters:', searchParams);

    // check each filter group to see if we can find one that passes
    for (const filterGroup of granularScopes[type][interaction]) {
      // console.log('\nchecking filter group...');
      let groupPasses = true;

      for (const filter of filterGroup) {
        // console.log(' checking filter field:', filter.field);

        let filterPasses = false;

        for (const [key, value] of searchParams) {
          // console.log('  checking value field:', key, 'value:', value);

          if (filter.field !== key) {
            // console.log('  skipping - fields do not match');
            continue;
          }

          let valueSplit = value.split('|');
          let valueSystem;
          let valueCodesString;

          if (valueSplit.length === 1) {
            valueSystem = '';
            valueCodesString = valueSplit[0];
          } else {
            valueSystem = valueSplit[0];
            valueCodesString = valueSplit[1];
          }

          let valueCodes = valueCodesString.split(',');

          let fieldPassCount = 0;

          // console.log('  Have value system:', valueSystem, 'codes:', valueCodes);

          for (const valueCode of valueCodes) {
            // console.log('   Checking value system:', valueSystem, 'code:', valueCode);

            for (const prop of filter.props) {
              // console.log('    Prop:', prop);
  
              // console.log('    Validating against filter system:', prop.system, 'code:', prop.code);
              if ((prop.system) &&
                  (prop.system !== '*') &&
                  (valueSystem !== prop.system)) {
                // console.log('    systems do not match');
                continue;
              }
              
              if (valueCode === prop.code) {
                // console.log('    match found, incrementing passes');
                filterPasses = true;
                fieldPassCount++;
                break;
              }
  
              // console.log('    values do not match');
            }
  
            if ((filterPasses) && (fieldPassCount === valueCodes.length)) {
              filterPasses = false;
              break;
            }
          }


          if (fieldPassCount === valueCodes.length) {
            // console.log('  Matched:', fieldPassCount, 'of', valueCodes.length, '--PASS--');
            filterPasses = true;
          } else {
            // console.log('  Matched:', fieldPassCount, 'of', valueCodes.length, '--FAIL--');
            filterPasses = false;
          }


        }

        if (!filterPasses) {
          // console.log('Filter group failed!');
          groupPasses = false;
          break;
        }
      }

      if (groupPasses) {
        return true;
      }

      // console.log('Group failed');
    }

    // console.log('All groups failed');

    // // check each parameter for failing
    // for (const [key, value] of searchParams) {
    //   console.log('--' + key + ' : ' + value);

    //   let passed = false;

    // }

    return false;
  }


  static addFilterGroupsForParams(interactionFilterGroups, scopeParams, launchRestrictions) {
    if (!scopeParams) {
      interactionFilterGroups = this.getOpenInteractionArray();
      return;
    }

    let filterGroup = [];

    let paramsSplit = scopeParams.split('&');
    paramsSplit.forEach((param) => {
      let kvp = param.split('=');

      if (kvp.length !== 2) {
        return;
      }

      let values = kvp[1].split(',');

      let props = [];

      values.forEach((value) => {
        let system;
        let code;

        let barIndex = value.indexOf('|');

        if (barIndex === -1) {
          system = '*';
          code = value;
        } else {
          system = value.substr(0, barIndex);
          code = value.substr(barIndex + 1);
        }

        props.push({
          system: system,
          code: code,
        });
      });

      filterGroup.push({
        field: kvp[0],
        props: props,
      });
    });

    if (launchRestrictions) {
      launchRestrictions.forEach((lr) => {
        filterGroup.push(lr);
      });
    }

    interactionFilterGroups.push(filterGroup);
  }

  static getOpenInteraction() {
    return {
      field: '*',
      props: [{
        system: '*',
        code: '*'
        },
      ],
    };
  }

  static getOpenInteractionArray() {
    return [this.getOpenInteraction()];
  }

  static isOpenInteraction(interactionFilterGroups) {
    if (interactionFilterGroups.length !== 1) {
      return false;
    }

    if (interactionFilterGroups[0].length !== 1) {
      return false;
    }

    if (interactionFilterGroups[0][0].field !== '*') {
      return false;
    }

    if (interactionFilterGroups[0][0].props.length !== 1) {
      return false;
    }

    if ((interactionFilterGroups[0][0].props[0].system !== '*') ||
        (interactionFilterGroups[0][0].props[0].code   !== '*')) {
      return false;
    }

    return true;
  }

  static addInteractionIfPresent(resourceInteractions, interaction, scopeOps, scopeParams, launchRestrictions) {
    if (scopeOps.indexOf(interaction) === -1) {
      return;
    } 

    if (!scopeParams) {
      resourceInteractions[interaction] = [this.getOpenInteractionArray()];
      return;
    }

    if (!resourceInteractions[interaction]) {
      resourceInteractions[interaction] = [];
    }

    let interactionFilterGroups = resourceInteractions[interaction];
    if (this.isOpenInteraction(interactionFilterGroups)) {
      return;
    }

    this.addFilterGroupsForParams(interactionFilterGroups, scopeParams, launchRestrictions);

    resourceInteractions[interaction] = interactionFilterGroups;
  }

  static addInteractionInfo(resourceScopePart, resourceInteractions, launchRestrictions) {
    let paramDelim = resourceScopePart.indexOf('?');
    let scopeOps = '';
    let scopeParameters = '';

    if (paramDelim === -1) {
      scopeOps = resourceScopePart;
    } else {
      scopeOps = resourceScopePart.substr(0, paramDelim);
      scopeParameters = resourceScopePart.substr(paramDelim + 1);
    }

    switch (scopeOps) {
      case 'read':
      case 'write':
      case '*':
        return false;
    }

    this.addInteractionIfPresent(resourceInteractions, 'c', scopeOps, scopeParameters, launchRestrictions);
    this.addInteractionIfPresent(resourceInteractions, 'r', scopeOps, scopeParameters, launchRestrictions);
    this.addInteractionIfPresent(resourceInteractions, 'u', scopeOps, scopeParameters, launchRestrictions);
    this.addInteractionIfPresent(resourceInteractions, 'd', scopeOps, scopeParameters, launchRestrictions);
    this.addInteractionIfPresent(resourceInteractions, 's', scopeOps, scopeParameters, launchRestrictions);

    return true;
  }

  static getGranularScopes(token) {
    if ((!token) || (!token.scope)) {
      return null;
    }

    let patient = token.patient;

    let scopes = {};
    let useGranular = false;

    let launchRestrictions = [];

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
            if (!scopes[resourceName]) {
              if (patient) {
                let opArray = [];
                this.addFilterGroupsForParams(opArray, '_id=' + patient);
                launchRestrictions = [{field: 'patient', props: [{code: 'Patient/' + patient}]}];
                scopes[resourceName] = {'r': opArray};
              } else {
                scopes[resourceName] = {'r': this.getOpenInteractionArray()};
              }
            }
          break;

        case 'patient':
          let resourceDelim = parts[1].indexOf('.');
          resourceName = parts[1].substr(0, resourceDelim);
          if (!scopes[resourceName]) {
            scopes[resourceName] = {};
          }

          if (this.addInteractionInfo(parts[1].substr(resourceDelim + 1), scopes[resourceName], launchRestrictions)) {
            useGranular = true;
          }
          
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
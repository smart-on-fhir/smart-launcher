import React, {useState, useEffect, useRef} from 'react';

import MainNavigation from './MainNavigation';
import { StorageHelper } from '../util/StorageHelper';
import {
  Button, Divider, Checkbox, Tooltip
} from '@blueprintjs/core';

import DataCard from './DataCard';
import { DataCardInfo } from '../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../models/RequestData';
import { DataCardStatus } from '../models/DataCardStatus';
import { CommonProps } from '../models/CommonProps';
import * as fhir from '../models/fhir_r4';
import Client from 'fhirclient/lib/Client';
import { LaunchScope } from '../models/LaunchScope';

export interface ResourceComponentProps {
  common:CommonProps;
  title:string,
  resourceName:string,
  id:string|undefined,
}

const _statusAvailable: DataCardStatus = {available: true, complete: false, busy: false};
const _statusBusy: DataCardStatus = {available: true, complete: false, busy: true};

export default function ResourceComponent(props:ResourceComponentProps) {

  const [cardInfo, setCardInfo] = useState<DataCardInfo|undefined>(undefined);
  const [cardData, setCardData] = useState<SingleRequestData[]>([]);
  const [cardStatus, setCardStatus] = useState<DataCardStatus>(_statusAvailable);

  const [scopeFilters, setScopeFilters] = useState<LaunchScope|undefined>(undefined);

  useEffect(() => {
    setScopeFilters(props.common.requestedScopes);
  }, [props.common.requestedScopes]);

  useEffect(() => {
    loadResource(props.common.requestedScopes);
  }, []);

  useEffect(() => {
    if (cardInfo !== undefined) {
      return;
    }

    let info:DataCardInfo = {
      id: 'resrouce-card-'+props.resourceName,
      heading: props.title,
      description: '',
      optional: false,
    }

    setCardInfo(info);
  }, [props.title, props.resourceName, cardInfo]);

  function buildTypeParameters(scopes:LaunchScope|undefined):string {
    let count:number = 0;
    let params:string = '';

    if (props.common.patientId) {
      params = addParam(params, count++, 'patient', `Patient/${props.common.patientId}`);
    }

    if (!scopes) {
      return params;
    }

    scopes!.forEach((checked:boolean, key:string) => {
      if (!checked) {
        return;
      }

      if (key.indexOf(`/${props.resourceName}.`) === -1) {
        return;
      }

      let paramIndex:number = key.indexOf('?');

      if (paramIndex === -1) {
        return;
      }

      let parameters:string[] = key.substr(paramIndex + 1).split('&');

      parameters.forEach((parameter) => {
        // let paramShort:string = key.substr(paramIndex + 1);
        // let components:string[] = paramShort.split('=');

        let components:string[] = parameter.split('=');
  
        if (components.length !== 2) {
          return;
        }
  
        params = addParam(params, count++, components[0], components[1]);
        });
    });

    return params;
  }

  function addParam(base:string, count:number, key:string, value:string|number|boolean):string {
    let params:string = '';

    if (count === 0) {
      params = base + `?${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    } else {
      params = base + `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
 
    return params;
  }

  function loadResource(scopes?:LaunchScope) {
    setCardStatus(_statusBusy);

    if (!scopes) {
      scopes = scopeFilters;
    }

    if ((props.resourceName) && (props.id)) {
      loadResourceById(scopes, props.resourceName, props.id!);
      return;
    }

    if (props.resourceName) {
      loadResourceByType(scopes, props.resourceName);
      return;
    }
  }

  function getBundleCount(bundle:any):string {
    if ((!bundle.resourceType) ||
        (bundle.resourceType !== 'Bundle')) {
      return '';
    }

    if (bundle.total !== undefined) {
      return `${bundle.total}`;
    }

    if (bundle.entry) {
      return `${bundle.entry.length}+...`;
    }

    return '';
  }

  async function loadResourceByType(scopes:LaunchScope|undefined, resourceName:string) {
    let client:Client|undefined = props.common.getFhirClient();

    if (!client) {
      console.log('No client');
      return;
    }

    let now:Date = new Date();

    let dataName:string;

    if (cardData.length === 0) {
      dataName = `Initial query: ${now.toLocaleTimeString()}`
    } else {
      dataName = `Query #${cardData.length}: ${now.toLocaleTimeString()}`
    }

    let params:string = buildTypeParameters(scopes);
    let url:string = `${resourceName}/${params}`;
    var response:any;

    try {
      response = await client.request(url);
      
      let data:SingleRequestData = {
        name: dataName,
        id: `request-${cardData.length}`,
        requestUrl: `${client.state.serverUrl}/${url}`,
        responseData: JSON.stringify(response, null, 2),
        responseDataType: RenderDataAsTypes.FHIR,
      };

      let paramMd:string = '';
      if (params) {
        paramMd = params.substr(1);
        let split:string[] = paramMd.split('&');
        paramMd = 
          '  | Parameter | Value |\n' + 
          '  |-----------|-------|\n';

        let lines:string[] = [];

        split.forEach((val:string) => {
          let components:string[] = val.split('=');
          if (components.length != 2) {
            return;
          }
          lines.push(`  |${components[0]}|\`${decodeURIComponent(components[1]).replace('|', '\\|')}\`|`);
        });

        lines.sort();
        paramMd += lines.join('\n');
      }

      let info:string = 
        `* Processed at: \`${now.toLocaleString()}\`\n` +
        `* Items returned: \`${getBundleCount(response)}\`\n` +
        `\n${paramMd}\n`;

      data.info = info;
      data.infoDataType = RenderDataAsTypes.Markdown;

      let updatedData:SingleRequestData[] = cardData.slice();
      updatedData.push(data);
      setCardData(updatedData);

    } catch (err) {
      let data:SingleRequestData = {
        name: dataName,
        id: `request-${cardData.length}`,
        requestUrl: `${client.state.serverUrl}/${url}`,
        responseData: JSON.stringify(err, null, 2),
        responseDataType: RenderDataAsTypes.Error,
      };

      let updatedData:SingleRequestData[] = cardData.slice();
      updatedData.push(data);
      setCardData(updatedData);
    }

    setCardStatus(_statusAvailable);
  }

  async function loadResourceById(scopes:LaunchScope|undefined, resourceName:string, id:string) {
    let client:Client|undefined = props.common.getFhirClient();

    if (!client) {
      console.log('No client');
      return;
    }

    let now:Date = new Date();

    let dataName:string;

    if (cardData.length === 0) {
      dataName = `Initial query: ${now.toLocaleTimeString()}`
    } else {
      dataName = `Query #${cardData.length}: ${now.toLocaleTimeString()}`
    }

    try {
      var response = await client.request(`${resourceName}/${id}`);
      
      let data:SingleRequestData = {
        name: dataName,
        id: `request-${cardData.length}`,
        requestUrl: `${client.state.serverUrl}/${resourceName}/${id}`,
        responseData: JSON.stringify(response, null, 2),
        responseDataType: RenderDataAsTypes.FHIR,
        info:
          `* Processed at: \`${now.toLocaleString()}\`\n` +
          `* \`${resourceName}/${id}\`\n`,
        infoDataType: RenderDataAsTypes.Markdown,
      };

      let updatedData:SingleRequestData[] = cardData.slice();
      updatedData.push(data);
      setCardData(updatedData);

    } catch (err) {
      let data:SingleRequestData = {
        name: dataName,
        id: `request-${cardData.length}`,
        requestUrl: `${client.state.serverUrl}/${resourceName}/${id}`,
        responseData: JSON.stringify(err, null, 2),
        responseDataType: RenderDataAsTypes.Error,
      };

      let updatedData:SingleRequestData[] = cardData.slice();
      updatedData.push(data);
      setCardData(updatedData);
    }

    setCardStatus(_statusAvailable);
  }

  function handleFilterChange(key:string) {
    let updated:LaunchScope = new LaunchScope(scopeFilters!);

    updated.set(key, !scopeFilters!.get(key));

    setScopeFilters(updated);
  }

  function elementsForFilters():JSX.Element[] {
    if (scopeFilters === undefined) {
      return([]);
    }

    let addedShortParams:string[] = [];

    let elements:JSX.Element[] = [];

    scopeFilters.forEach((requested:boolean, key:string) => {
      if (key.indexOf(`/${props.resourceName}.`) === -1) {
        return;
      }

      let paramIndex:number = key.indexOf('?');

      if (paramIndex === -1) {
        return;
      }

      let paramShort:string = key.substr(paramIndex + 1);

      if (addedShortParams.indexOf(paramShort) !== -1) {
        return;
      }

      addedShortParams.push(paramShort);

      if (paramShort.length > 25) {
        elements.push(
          <Tooltip
            key={`tt_${key}`}
            content={paramShort}
            >
            <Checkbox
              key={key}
              className='fixed-checkbox'
              label={paramShort}
              inline={true}
              checked={requested}
              onClick={() => handleFilterChange(key)}
              />
          </Tooltip>);
      } else {
        elements.push(
          <Checkbox
            key={key}
            className='fixed-checkbox'
            label={paramShort}
            inline={true}
            checked={requested}
            onClick={() => handleFilterChange(key)}
            />);
      }

    });

    if (elements.length > 0) {
      elements.push(<Divider key={'di_' + elements.length} />);
    }

    return elements;
  }

  function addCard():JSX.Element {
    if (cardInfo === undefined) {
      return (<div/>);
    }

    return (
      <DataCard
        key={'resource-card-'+props.resourceName}
        info={cardInfo!}
        data={cardData}
        status={cardStatus}
        common={props.common}
        tabButtonText={props.id ? 'Load' : 'Search'} 
        tabButtonHandler={() => loadResource(undefined)}
        >
        {elementsForFilters()}
      </DataCard>
    );
  }

  return (addCard());
}
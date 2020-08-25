import React, {useState, useEffect, useRef} from 'react';

import MainNavigation from './MainNavigation';
import { StorageHelper } from '../util/StorageHelper';
import {
  Overlay,
  Classes,
  Switch,
  Card,
  Elevation,
  H5, H6,
  Divider,
  IToaster,
  IconName,
  IToasterProps,
  Position,
  Toaster,
  Intent,
  Button
} from '@blueprintjs/core';
import {IconNames} from '@blueprintjs/icons';

import StandaloneParameters from './StandaloneParameters';
import { LaunchScope, ScopeComparison } from '../models/LaunchScope';

import DataCard from './DataCard';
import { DataCardInfo } from '../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../models/RequestData';
import { DataCardStatus } from '../models/DataCardStatus';
import { CommonProps } from '../models/CommonProps';
import * as fhir from '../models/fhir_r4';
import Client from 'fhirclient/lib/Client';

export interface ResourceComponentProps extends CommonProps {
  title:string,
  resourceName:string,
  id:string|undefined,
}

const _statusAvailable: DataCardStatus = {available: true, complete: false, busy: false};

export default function ResourceComponent(props:ResourceComponentProps) {
  const initialLoadRef = useRef<boolean>(true);

  const [cardInfo, setCardInfo] = useState<DataCardInfo|undefined>(undefined);
  const [cardData, setCardData] = useState<SingleRequestData[]>([]);
  const [cardStatus, setCardStatus] = useState<DataCardStatus>(_statusAvailable);

  useEffect(() => {
    if (initialLoadRef.current) {
      loadResource(); 
      initialLoadRef.current = false;
    }
  }, [loadResource]);

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

  function loadResource() {
    if (props.id) {
      loadResourceById(props.id!);
    }
  }

  async function loadResourceById(id:string) {
    let client:Client|undefined = props.getFhirClient();

    if (!client) {
      console.log('No client');
      return;
    }

    let now:Date = new Date();

    let dataName:string;

    if (cardData.length === 0) {
      dataName = `Initial request: ${now.toLocaleTimeString()}`
    } else {
      dataName = `Reload #${cardData.length}: ${now.toLocaleTimeString()}`
    }

    try {
      var response = await client.request(`${props.resourceName}/${id}`);
      
      let data:SingleRequestData = {
        name: dataName,
        id: `request-${cardData.length}`,
        requestUrl: `${client.state.serverUrl}/${props.resourceName}/${id}`,
        responseData: JSON.stringify(response, null, 2),
        responseDataType: RenderDataAsTypes.FHIR,
      };

      let updatedData:SingleRequestData[] = cardData.slice();
      updatedData.push(data);
      setCardData(updatedData);

    } catch (err) {
      let data:SingleRequestData = {
        name: dataName,
        id: `request-${cardData.length}`,
        requestUrl: `${client.state.serverUrl}/${props.resourceName}/${id}`,
        responseData: JSON.stringify(err, null, 2),
        responseDataType: RenderDataAsTypes.Error,
      };

      let updatedData:SingleRequestData[] = cardData.slice();
      updatedData.push(data);
      setCardData(updatedData);
    }
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
        status={_statusAvailable}
        parentProps={{
          isUiDark: props.isUiDark,
          aud: props.aud,
          setAud: props.setAud,
          startAuth: props.startAuth,
          refreshAuth: props.refreshAuth,
          getFhirClient: props.getFhirClient,
          toaster: props.toaster,
          copyToClipboard: props.copyToClipboard,
        }}
        >
        <Button
          onClick={() => loadResource()}
          >
          Load  
        </Button>
      </DataCard>
    );
  }

  return (addCard());
}
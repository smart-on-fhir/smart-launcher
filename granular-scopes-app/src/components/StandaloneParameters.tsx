import React, {useState, useRef, useEffect} from 'react';
import { CommonProps } from '../models/CommonProps';
import { 
  Button,
  Card, 
  Elevation,
  H5, H6,
  Tabs, 
  TabId,
  Tab,
  Tooltip,
  FormGroup,
  InputGroup,
  Divider,
  Intent,
} from '@blueprintjs/core';
import ParametersTabV1 from './ParametersTabV1';
import { LaunchScope } from '../models/LaunchScope';
import ParametersTabScenarios from './ParametersTabScenarios';

export interface StandaloneParametersProps {
  common:CommonProps;
}


export default function StandaloneParameters(props: StandaloneParametersProps) {
  const initialLoadRef = useRef<boolean>(true);

  const [selectedTabId, setSelectedTabId] = useState<string>('');

  useEffect(() => {
    if (initialLoadRef.current) {
      setSelectedTabId(sessionStorage.getItem('standalone-selected-tab-id') ?? 'parameter-tab-v1');

      initialLoadRef.current = false;
    }
  }, []);

  function handleTabChange(tabId: TabId) {
    setSelectedTabId(tabId.toString());
    sessionStorage.setItem('standalone-selected-tab-id', tabId.toString());
  }

  function handleInputAudChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.common.setAud(event.target.value);
  }

  function handleLaunchClick() {
    if (!props.common.requestedScopes) {
      props.common.toaster('No Scopes Available!');
      return;
    }

    props.common.startAuth();
  }

  return(
    <Card
      interactive={false}
      elevation={Elevation.ONE}
      >
      <H5>Standalone Launch</H5>
      <FormGroup
        label='Audience'
        helperText='URL requests will be sent to'
        labelFor='input-aud'
        >
        <InputGroup
          id='input-aud'
          value={props.common.aud}
          onChange={handleInputAudChange}
          />
      </FormGroup>
      <Divider />
      <Tabs
        id='standalone-parameter-tabs'
        animate={true}
        vertical={false}
        selectedTabId={selectedTabId}
        onChange={handleTabChange}
        
        >
        <H6>Scopes:</H6>
        <Tab
          id='parameter-tab-v1'
          title='SMART V1'
          panel={
            <ParametersTabV1
              common={props.common}
              />
          }
          />
        <Tab
          id='parameter-tab-scenarios'
          title='Scenarios'
          panel={
            <ParametersTabScenarios
              common={props.common}
              />
          }
          />
        <Tab
          id='parameter-tab-playground'
          title='Playground'
          panel={
            <Card>Coming soon...</Card>
          }
          />
      </Tabs>
      <Divider />
      <Button
        key='run-request'
        id='run-request'
        text='Launch Auth Redirect'
        onClick={handleLaunchClick}
        />
      <Tooltip
        content='Refresh the existing token (does NOT change scopes)'
        >
        <Button
          key='refresh-request'
          id='refresh-request'
          text='Refresh Token'
          disabled={false}
          onClick={() => props.common.refreshAuth()}
          />
      </Tooltip>
    </Card>
  );
}
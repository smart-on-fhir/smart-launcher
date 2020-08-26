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
} from '@blueprintjs/core';
import ParametersTabV1 from './ParametersTabV1';
import { LaunchScope } from '../models/LaunchScope';

export interface StandaloneParametersProps extends CommonProps {
}


export default function StandaloneParameters(props: StandaloneParametersProps) {
  const initialLoadRef = useRef<boolean>(true);

  const [selectedTabId, setSelectedTabId] = useState<string>('');
  const [scopes, setScopes] = useState<LaunchScope|undefined>();

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
    props.setAud(event.target.value);
  }

  function handleLaunchClick() {
    if (!scopes) {
      props.toaster('No Scopes Available!');
      return;
    }

    props.startAuth(scopes!)
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
          value={props.aud}
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
              isUiDark={props.isUiDark}
              aud={props.aud}
              setAud={props.setAud}
              startAuth={props.startAuth}
              refreshAuth={props.refreshAuth}
              getFhirClient={props.getFhirClient}
              toaster={props.toaster}
              copyToClipboard={props.copyToClipboard}
              setScopes={setScopes}
              />
          }
          />
        <Tab
          id='parameter-tab-scenarios'
          title='Scenarios'
          panel={
            <Card>Test</Card>
          }
          />
        <Tab
          id='parameter-tab-playground'
          title='Playground'
          panel={
            <Card>Playground</Card>
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
          onClick={() => props.refreshAuth()}
          />
      </Tooltip>
    </Card>
  );
}

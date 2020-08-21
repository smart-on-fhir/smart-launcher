import React, {useState, useRef, useEffect} from 'react';
import { ComponentProps } from '../models/ComponentProps';
import { 
  Card, 
  Elevation,
  H5,
  Tabs, 
  TabId,
  Tab,
} from '@blueprintjs/core';
import ParametersTabV1 from './ParametersTabV1';

export interface StandaloneParametersProps extends ComponentProps {
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

  return(
    <Card
      interactive={false}
      elevation={Elevation.ONE}
      >
      <H5>Standalone Launch</H5>
      <Tabs
        id='standalone-parameter-tabs'
        animate={true}
        vertical={false}
        selectedTabId={selectedTabId}
        onChange={handleTabChange}
        >
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
              toaster={props.toaster}
              copyToClipboard={props.copyToClipboard}
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
    </Card>
  );
}

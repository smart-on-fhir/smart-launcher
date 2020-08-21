import React, {useState, useRef, useEffect} from 'react';
import { ComponentProps } from '../models/ComponentProps';
import { 
  Card, 
  Divider, 
  Button, 
  FormGroup, 
  InputGroup, 
  Checkbox, 
  Tooltip,
} from '@blueprintjs/core';
import { LaunchScope } from '../models/LaunchScope';

export interface ParametersTabV1Props extends ComponentProps {
}

const _defaultScopes:LaunchScope = new LaunchScope([
  ['openid', true],
  ['fhirUser', true],
  ['offline_access', true],
  ['online_access', false],
  ['smart/orchestrate_launch', false],
  ['profile', true],
  ['launch/patient', true],
  ['launch/encounter', true],
  ['patient/*.read', false],
  ['patient/*.write', false],
  ['patient/*.*', true],
  ['user/*.*', true],
]);

const _scopeKey:string = 'smart-parameters-v1';

export default function ParametersTabV1(props: ParametersTabV1Props) {
  const initialLoadRef = useRef<boolean>(true);

  const [scopes, setScopes] = useState<LaunchScope>(_defaultScopes);

  useEffect(() => {
    if (initialLoadRef.current) {
      scopes.load(_scopeKey, false);

      initialLoadRef.current = false;
    }
  }, [scopes]);

  function handleInputAudChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.setAud(event.target.value);
  }

  function handleScopeChange(name:string) {
    let updated:LaunchScope = new LaunchScope(scopes);

    updated.set(name, !scopes.get(name));
    updated.save(_scopeKey);

    setScopes(updated);
  }

  function elementsForScopes() {
    let boxes:JSX.Element[] = [];

    let lines:number = 0;

    scopes.forEach((value, key) => {
      switch (key) {
        case 'patient/*.read':
        case 'launch/patient':
          boxes.push(<br key={`br_${lines++}`} />);
          break;
      }

      boxes.push(
        <Checkbox
          key={key}
          className='fixed-checkbox'
          label={key}
          inline={true}
          checked={value}
          onClick={() => handleScopeChange(key)}
          />);
    })

    return boxes;
  }

  return(
    <Card
      interactive={false}
      >
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
      <FormGroup
        label='Scopes'
        helperText='Scopes based on SMART V1'
        >
        { elementsForScopes() }
      </FormGroup>
      <Button
        key='run-request'
        id='run-request'
        text='Launch Auth Redirect'
        onClick={() => props.startAuth(scopes)}
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

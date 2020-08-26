import React, {useState, useRef, useEffect} from 'react';
import { CommonProps } from '../models/CommonProps';
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

export interface ParametersTabV1Props extends CommonProps {
  setScopes: ((currentScopes:LaunchScope) => void);
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
      let savedScopes:LaunchScope = LaunchScope.load(_scopeKey);

      if (savedScopes.size > _defaultScopes.size) {
        setScopes(savedScopes);
        props.setScopes(savedScopes);
      } else {
        props.setScopes(_defaultScopes);
      }

      initialLoadRef.current = false;
    }
  }, [scopes, setScopes]);

  function handleScopeChange(name:string) {
    let updated:LaunchScope = new LaunchScope(scopes);

    updated.set(name, !scopes.get(name));
    updated.save(_scopeKey);

    setScopes(updated);
    props.setScopes(updated);
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
        label='Scopes'
        helperText='Scopes based on SMART V1'
        >
        { elementsForScopes() }
      </FormGroup>
    </Card>
  );
}

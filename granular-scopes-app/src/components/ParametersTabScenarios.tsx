import React, {useState, useRef, useEffect} from 'react';
import { CommonProps } from '../models/CommonProps';
import { 
  Card, 
  FormGroup, 
  Checkbox, 
  Tooltip,
} from '@blueprintjs/core';
import { LaunchScope } from '../models/LaunchScope';

export interface ParametersTabScenariosProps {
  common:CommonProps;
}

const _defaultScopes:LaunchScope = new LaunchScope([
  ['openid', true],
  ['fhirUser', true],
  ['offline_access', true],
  ['online_access', false],
  ['smart/orchestrate_launch', false],
  ['profile', true],
  ['launch/patient', true],
  ['launch/encounter', false],
  ['patient/Observation.r', false],
  ['patient/Observation.rs', true],
  ['patient/Observation.crs', false],
  ['patient/Observation.rs?category=vital-signs', false],
  ['patient/Observation.rs?category=laboratory', false],
  ['patient/Observation.rs?category=http://terminology.hl7.org/CodeSystem/observation-category|vital-signs', false],
  ['patient/Observation.crs?category=vital-signs', false],
  ['patient/Observation.rs?_security=L', false],
  ['patient/Observation.rs?_security=http://terminology.hl7.org/CodeSystem/v3-Confidentiality|L', false],
  ['patient/Observation.rs?_security=N', false],
  ['patient/Observation.rs?_security=R', false],
  ['patient/Observation.rs?_security=V', false],
  ['patient/Observation.rs?_security=L,N', false],
  ['patient/Observation.rs?_security=L,N,R', false],
  ['patient/Observation.rs?_security=L,N,R,V', false],
  ['patient/Observation.rs?category=vital-signs&_security=L', false],
]);

const _scopeKey:string = 'smart-parameters-scenarios';

export default function ParametersTabScenarios(props: ParametersTabScenariosProps) {
  const initialLoadRef = useRef<boolean>(true);

  const [scopes, setScopes] = useState<LaunchScope>(_defaultScopes);

  useEffect(() => {
    if (initialLoadRef.current) {
      let savedScopes:LaunchScope = LaunchScope.load(_scopeKey);

      if (savedScopes.size >= _defaultScopes.size) {
        setScopes(savedScopes);
        props.common.setRequestedScopes(savedScopes);
      } else {
        props.common.setRequestedScopes(_defaultScopes);
      }

      initialLoadRef.current = false;
    }
  }, [scopes, setScopes]);

  function handleScopeChange(name:string) {
    let updated:LaunchScope = new LaunchScope(scopes);

    updated.set(name, !scopes.get(name));
    updated.save(_scopeKey);

    setScopes(updated);
    props.common.setRequestedScopes(updated);
  }

  function elementsForScopes() {
    let elements:JSX.Element[] = [];

    let lines:number = 0;

    scopes.forEach((value, key) => {
      switch (key) {
        case 'patient/Observation.rs?category=vital-signs&_security=L':
        case 'patient/Observation.r':
        case 'patient/Observation.rs?category=vital-signs':
        case 'patient/Observation.rs?_security=L':
        case 'launch/patient':
          elements.push(<br key={`br_${lines++}`} />);
          break;
      }

      if (key.length > 25) {
        elements.push(
          <Tooltip
            content={key}
            >
            <Checkbox
              key={key}
              className='fixed-checkbox'
              label={key}
              inline={true}
              checked={value}
              onClick={() => handleScopeChange(key)}
              />
          </Tooltip>);
      } else {
        elements.push(
          <Checkbox
            key={key}
            className='fixed-checkbox'
            label={key}
            inline={true}
            checked={value}
            onClick={() => handleScopeChange(key)}
            />);
      }
    });

    return elements;
  }

  return(
    <Card
      interactive={false}
      >
      <FormGroup
        label='Scopes'
        helperText='Scopes based on Connectathon Scenarios'
        >
        { elementsForScopes() }
      </FormGroup>
    </Card>
  );
}

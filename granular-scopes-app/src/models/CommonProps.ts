import { LaunchScope, ScopeComparison } from './LaunchScope';
import { IconName } from '@blueprintjs/core';
import Client from '../fhirclient/lib/Client';
import { SmartConfiguration } from './SmartConfiguration';

export interface CommonProps {
  isUiDark: boolean;

  loadSmartConfig: (() => void);

  usePKCE:boolean;
  togglePKCE: (() => void);

  intropectionIsPossible: boolean;
  introspectToken: (() => void);

  aud: string;
  setAud: ((aud: string) => void);
  appId: string;
  setAppId: ((appId: string) => void);
  profile:string;
  fhirUser:string;
  patientId:string;
  requestedScopes:LaunchScope;
  setRequestedScopes:((scopes:LaunchScope) => void);

  startAuth: (() => void);
  refreshAuth: (() => void);
  getFhirClient: (() => Client|undefined);

  toaster: ((message: string, iconName?: IconName, timeout?: number) => void);
  copyToClipboard: ((message: string, toast?: string) => void);
}

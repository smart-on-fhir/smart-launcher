import { LaunchScope } from './LaunchScope';
import { IconName } from '@blueprintjs/core';
import Client from 'fhirclient/lib/Client';

export interface CommonProps {
  isUiDark: boolean;

  aud: string;
  setAud: ((aud: string) => void);
  profile:string;
  fhirUser:string;
  patientId:string;

  startAuth: ((requestedScopes:LaunchScope) => void);
  refreshAuth: ((requestedScopes?:LaunchScope) => void);
  getFhirClient: (() => Client|undefined);

  toaster: ((message: string, iconName?: IconName, timeout?: number) => void);
  copyToClipboard: ((message: string, toast?: string) => void);
}
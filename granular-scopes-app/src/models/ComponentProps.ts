import { LaunchScope } from './LaunchScope';
import { IconName } from '@blueprintjs/core';

export interface ComponentProps {
  isUiDark: boolean;

  aud: string;
  setAud: ((aud: string) => void);

  startAuth: ((requestedScopes:LaunchScope) => void);
  refreshAuth: ((requestedScopes?:LaunchScope) => void);

  toaster: ((message: string, iconName?: IconName, timeout?: number) => void);
  copyToClipboard: ((message: string, toast?: string) => void);
}
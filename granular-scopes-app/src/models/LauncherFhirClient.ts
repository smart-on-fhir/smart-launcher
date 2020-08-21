import { fhirclient } from "fhirclient/lib/types";

export interface LauncherFhirClient extends fhirclient.ClientState {
  userId?: string;
  patient: any;
}
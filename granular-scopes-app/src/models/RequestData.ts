
export enum RenderDataAsTypes {
  None,
  FHIR,
  JSON,
  Error,
  Text,
  Markdown,
  HTML,
}

export interface SingleRequestData {
  name: string;
  id: string;
  requestUrl?: string;
  requestDataType?: RenderDataAsTypes;
  requestData?: string;
  responseDataType?: RenderDataAsTypes;
  responseData?: string;
  outcome?: string;
  info?: string;
  infoDataType?: RenderDataAsTypes;
  extended?: Map<string,string>;
  extendedDataType?: RenderDataAsTypes;
  enabled?: boolean;
}
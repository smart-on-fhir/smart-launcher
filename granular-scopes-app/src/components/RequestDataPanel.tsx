import React, {useState, useEffect} from 'react';

import {
  Button, Tabs, Tab, Tooltip, TabId, Icon, Switch, 
} from '@blueprintjs/core';
import { CommonProps } from '../models/CommonProps';
import { IconNames, IconName } from '@blueprintjs/icons';
import { SingleRequestData, RenderDataAsTypes } from '../models/RequestData';

// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { 
  vscDarkPlus as highlightDark, 
  coy as highlightLight 
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import ReactMarkdown from 'react-markdown/with-html';

export interface RequestPanelProps {
  common: CommonProps,
  data: SingleRequestData[],
  busy?: boolean,
  processRowDelete?: ((index: number) => void),
  processRowToggle?: ((index: number) => void),
  selectedDataRowIndex?: number,
  tabButtonText?: string,
  tabButtonHandler?: ((index: number) => void),
}

export default function RequestDataPanel(props: RequestPanelProps) {

  const [selectedTabId, setSelectedTabId] = useState<string>('');
  const [displayedTabId, setDisplayedTabId] = useState<string>('');

  const dataRowIndex:number = ((props.selectedDataRowIndex === undefined) || (props.selectedDataRowIndex === -1))
    ? (props.data ? props.data.length - 1 : -1 )
    : props.selectedDataRowIndex!;

  useEffect(() => {
    if ((selectedTabId === displayedTabId) && (selectedTabId !== '')) {
      return;
    }

    if ((!props.data) || (props.data.length === 0)) {
      setDisplayedTabId('');
      return;
    }

    if (selectedTabId !== '') {
      setDisplayedTabId(selectedTabId);
    }
      
    if (selectedTabId === '') {
      if (props.data[dataRowIndex].info) {
        setDisplayedTabId('info');
      } else if (props.data[dataRowIndex].responseData) {
        setDisplayedTabId('response_data');
      } else if (props.data[dataRowIndex].outcome) {
        setDisplayedTabId('outcome');
      } else if (props.data[dataRowIndex].requestData) {
        setDisplayedTabId('request_data');
      } else if (props.data[dataRowIndex].requestUrl) {
        setDisplayedTabId('request_url');
      }
    }
  }, [props.data, selectedTabId, displayedTabId, dataRowIndex]);

  if ((!props.data) || (props.data.length === 0)) {
    return(null);
  }

  function iconNameForType(dataType: RenderDataAsTypes|undefined) {
    switch (dataType)
    {
      case RenderDataAsTypes.None: return IconNames.MINUS; //break;
      case RenderDataAsTypes.FHIR: return IconNames.FLAME; //break;
      case RenderDataAsTypes.JSON: return IconNames.CODE; //break;
      case RenderDataAsTypes.Error: return IconNames.ERROR; //break;
      case RenderDataAsTypes.Text: return IconNames.ALIGN_LEFT; //break;
      default: return IconNames.INFO_SIGN; //break;
    }
  }

  function handleTabChange(navbarTabId: TabId) {
    setSelectedTabId(navbarTabId.toString());
  }

  function handleCopyClick() {
    switch (displayedTabId)
    {
      case 'request_url':
        props.common.copyToClipboard(props.data[dataRowIndex].requestUrl!, 'Request URL');
        return;
        // break;
      case 'request_data':
        props.common.copyToClipboard(props.data[dataRowIndex].requestData!, 'Request Data');
        return;
        // break;
      case 'response_data':
        props.common.copyToClipboard(props.data[dataRowIndex].responseData!, 'Response Data');
        return;
        // break;
      case 'info':
        props.common.copyToClipboard(props.data[dataRowIndex].info!, 'Info');
        return;
        // break;
      case 'outcome':
        props.common.copyToClipboard(props.data[dataRowIndex].outcome!, 'OperationOutcome');
        return;
        // break;
    }

    if (props.data[dataRowIndex].extended) {
      props.data[dataRowIndex].extended!.forEach((value:string, name:string) => {
        let key:string = nameToKey(name);

        if (key === displayedTabId) {
          props.common.copyToClipboard(value);
        }
      });
    }
  }

  function handleDeleteClick() {
    props.processRowDelete!(dataRowIndex);
  }

  function handleToggle() {
    props.processRowToggle!(dataRowIndex);
  }

  function handleTabButtonClick() {
    props.tabButtonHandler!(dataRowIndex);
  }

  function buildTab(
    key:string,
    name:string,
    content:string,
    renderAs?:RenderDataAsTypes,
    iconName?:IconName):JSX.Element 
    {
    let lang:string;
    switch (renderAs) {
      case RenderDataAsTypes.Text:
      case RenderDataAsTypes.Error:
          lang = 'text';
        break;

      case RenderDataAsTypes.FHIR:
      case RenderDataAsTypes.JSON:
        lang = 'json';
        break;

      case RenderDataAsTypes.Markdown:
        lang = 'markdown';
        break;
  
      case RenderDataAsTypes.HTML:
        lang = 'html';
        break;
    
      default:
        lang = 'text';
        break;
    }

    if ((renderAs === RenderDataAsTypes.Markdown) || 
        (renderAs === RenderDataAsTypes.HTML)) {
      return (
        <Tab
          key={key}
          id={key}
          panel={
            <ReactMarkdown
              className={props.common.isUiDark ? 'code-md-tab-dark' : 'code-md-tab-light'}
              source={content}
              escapeHtml={false}
              />
            }
          >
        <Icon icon={iconName ?? IconNames.INFO_SIGN} /> {name}
        </Tab>
      );
    }

    return (
      <Tab
        key={key}
        id={key}
        panel={
          <SyntaxHighlighter
            className='code-tab'
            language={lang}
            // style={props.common.isUiDark ? atomOneDark : atomOneLight}
            style={props.common.isUiDark ? highlightDark : highlightLight}
            >
            {content}
          </SyntaxHighlighter>
          }
        >
        <Icon icon={iconName ?? IconNames.INFO_SIGN} /> {name}
      </Tab>
    );
  }

  function nameToKey(name:string):string {
    return name.replace(' ', '_').toLowerCase();
  }

  function buildDataTabs() {
    let tabs:JSX.Element[] = [];

    if (props.data[dataRowIndex].requestUrl) {
      tabs.push(
          buildTab(
            'request_url', 
            'Request URL',
            props.data[dataRowIndex].requestUrl!,
            RenderDataAsTypes.Text,
            IconNames.GLOBE_NETWORK));
    }

    if (props.data[dataRowIndex].requestData) {
      tabs.push(
          buildTab(
            'request_data',
            'Request Data',
            props.data[dataRowIndex].requestData!,
            props.data[dataRowIndex].requestDataType ?? RenderDataAsTypes.JSON,
            iconNameForType(props.data[dataRowIndex].requestDataType ?? RenderDataAsTypes.JSON)));
    }

    if (props.data[dataRowIndex].outcome) {
      tabs.push(
          buildTab(
            'outcome',
            'Outcome',
            props.data[dataRowIndex].outcome!,
            RenderDataAsTypes.FHIR,
            IconNames.FLAME));
    }

    if (props.data[dataRowIndex].responseData) {
      tabs.push(
          buildTab(
            'response_data',
            'Response Data',
            props.data[dataRowIndex].responseData!,
            props.data[dataRowIndex].responseDataType ?? RenderDataAsTypes.Text,
            iconNameForType(props.data[dataRowIndex].responseDataType ?? RenderDataAsTypes.Text)));
    }

    if (props.data[dataRowIndex].info) {
      tabs.push(
          buildTab(
            'info',
            'Info',
            props.data[dataRowIndex].info!,
            props.data[dataRowIndex].infoDataType ?? RenderDataAsTypes.JSON,
            IconNames.INFO_SIGN));
    }

    if (props.data[dataRowIndex].extended) {
      props.data[dataRowIndex].extended!.forEach((value:string, name:string) => {
        let key:string = nameToKey(name);
        tabs.push(
          buildTab(
            key,
            name,
            value,
            props.data[dataRowIndex].extendedDataType ?? RenderDataAsTypes.Text,
            iconNameForType(props.data[dataRowIndex].extendedDataType)));
      });
    }

    return tabs;
  }

  return(
    <Tabs
      animate={true}
      vertical={true}
      selectedTabId={displayedTabId}
      onChange={handleTabChange}
      >
      <div>
        <Tooltip content='Copy To Clipboard'>
          <Button 
            icon={IconNames.DUPLICATE} 
            minimal 
            style={{marginLeft:5, marginRight:5, marginTop:10}}
            onClick={handleCopyClick}
            />
        </Tooltip>
        { (props.processRowDelete !== undefined) &&
          <Tooltip content='Delete'>
            <Button 
              icon={IconNames.DELETE} 
              minimal 
              style={{marginLeft:5, marginRight:5, marginTop:10}}
              onClick={handleDeleteClick}
              />
          </Tooltip>
        }
      </div>
      { (props.processRowToggle !== undefined) &&
        <div>
          <Switch
            disabled={props.busy}
            checked={props.data[dataRowIndex].enabled}
            label='Enabled' 
            onChange={handleToggle}
            />
        </div>
      }
      { ((props.tabButtonText !== undefined) && (props.tabButtonHandler !== undefined)) &&
        <div>
          <Button
            disabled={props.busy}
            text={props.tabButtonText!}
            onClick={handleTabButtonClick}
            />
        </div>
      }
      {buildDataTabs()}
    </Tabs>
  );
}
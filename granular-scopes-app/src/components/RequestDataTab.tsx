import React from 'react';

import {
  Tab, Icon,
} from '@blueprintjs/core';

import { IconName } from '@blueprintjs/icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export interface RequestDataTabProps {
  id: string,
  name: string,
  codePaneDark: boolean,
  data: string,
  iconName: IconName
}

export default function RequestDataTab(props: RequestDataTabProps) {
  return(
    <Tab
      key={props.id}
      panel={<SyntaxHighlighter
        language='json'
        style={props.codePaneDark ? atomOneDark : atomOneLight}
        >
        {props.data}
      </SyntaxHighlighter>}
      >
      <Icon icon={props.iconName} /> {props.name}
    </Tab>
  );
}
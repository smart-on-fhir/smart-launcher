import React, {useState} from 'react';

import {
  Navbar,
  ResizeSensor,
  IResizeEntry,
  Classes,
  NavbarGroup,
  Alignment,
  NavbarHeading,
  Switch,
  Icon,
  Intent,
  Button,

} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';

/** Minimum width to render the full menu */
const _minWidthToRenderFull: number = 900;

export interface MainNavigationProps {
  toggleSettingsVisible: (() => void);
}

export default function MainNavigation(props: MainNavigationProps) {

  const [renderSmall, setRenderSmall] = useState<boolean>(false);

    /** Function to handle resize events on the nav bar */
    function handleResize(entries: IResizeEntry[]) {
      if ((renderSmall) && (entries[0].contentRect.width > _minWidthToRenderFull)) {
        // **** change to full render ****

        setRenderSmall(false);
        return;
      }

      if ((!renderSmall) && (entries[0].contentRect.width < _minWidthToRenderFull)) {
        // **** change to small render ****

        setRenderSmall(true);
        return;
      }
    }


  return (
    <ResizeSensor onResize={handleResize}>
      <Navbar className={Classes.DARK}>
        <NavbarGroup align={Alignment.LEFT}>
          <img
            src='smart-logo.png'
            alt='SMART Logo'
            className='nav-logo'
            />
          <NavbarHeading>SMART Granular Scopes - September 2020 Connectathon</NavbarHeading>
        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}>
          <Button
            onClick={() => props.toggleSettingsVisible()}
            icon={IconNames.COG}
            large={true}
            
            >
            {/* <Icon
              icon={IconNames.SETTINGS}
              intent={Intent.NONE}
              iconSize={Icon.SIZE_LARGE}
              /> */}
          </Button>
          {/* <Switch
            checked={props.uiDark}
            label='Dark'
            onChange={() => props.toggleUiColors()}
            /> */}
        </NavbarGroup>

      </Navbar>
    </ResizeSensor>
  );
}
import * as React from 'react';
import {useState} from 'react'
import {Stack, Box, Typography, Drawer, Button, List, Divider, ListItem, ListItemButton, ListItemIcon} from '@mui/material'
import AvTimerIcon from '@mui/icons-material/AvTimer';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export default function Navsides({features} : {features : string[]}) {

    const [state, setState] = useState(false);

    const toggleDrawer = () =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
         event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState(!state);
    }

    // which icon to call 
    const whichIcon = (text : string) => {
      if (text == 'timer') {
        return <AvTimerIcon />;
      } else if (text === 'reminder') {
        return <NotificationsNoneIcon />;
      } else {
        return <FormatListBulletedIcon />;
      }
    };

    //list of icon on the drawer
  const list = () => (
    <Box
      sx={{width: 250}}
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      <List>
        {features.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton href={"/" + text}>
              <ListItemIcon>
                <Stack direction='row' gap={5}>
                  {whichIcon(text)}
                  {text}
                </Stack>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <Button variant="contained" onClick={toggleDrawer()}> nav</Button>
      <Drawer
          anchor={'left'}
          open={state}
          onClose={toggleDrawer()}
      >
        <Divider />
        {list()}
      </Drawer>
    </>
  );
}

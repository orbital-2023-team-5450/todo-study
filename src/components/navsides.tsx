import * as React from 'react';
import {useState} from 'react'
import {Stack, Box, Typography, Drawer, Button, List, Divider, ListItem, ListItemButton, ListItemIcon} from '@mui/material'
import AvTimerIcon from '@mui/icons-material/AvTimer';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

const features : {feature: string, app: JSX.Element}[] = [
  {feature: "Dashboard", app: <HomeIcon />},
  {feature: "Timer", app: <AvTimerIcon />},
  {feature: "Reminders", app: <NotificationsNoneIcon />}, 
  {feature: "Tasks", app: <FormatListBulletedIcon />}];

export default function Navsides() {
  const [state, setState] = useState(false);
  const toggleDrawer = () =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
         (event as React.KeyboardEvent).key === 'Shift')
      ) return;
      setState(!state);
    }

  //list of icon on the drawer
  const list = () => (
    <Box
      sx={{width: 250}}
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      <List>
        {features.map((f) => (
          <ListItem key={f.feature} disablePadding>
            <ListItemButton href={"/" + f.feature.toLowerCase()}>
              <ListItemIcon>
                <Stack direction='row' gap={5}>
                  {f.app}
                  {f.feature}
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
      <Button variant="contained" onClick={toggleDrawer()} disableElevation><MenuIcon /></Button>
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

import * as React from 'react';
import {useState} from 'react'
import {Stack, Box, Drawer, Button, List, Divider, ListItem, ListItemButton, ListItemIcon} from '@mui/material'
import AvTimerIcon from '@mui/icons-material/AvTimer';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountNav from './AccountNav';

const features : {feature: string, app: JSX.Element}[] = [
  {feature: "Dashboard", app: <HomeIcon />},
  {feature: "Timer", app: <AvTimerIcon />},
  {feature: "Notes", app: <EditNoteRoundedIcon />}, 
  {feature: "Tasks", app: <FormatListBulletedIcon />},
  {feature: "Account Settings", app: <ManageAccountsIcon />}];

export default function NavSides() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
         (event as React.KeyboardEvent).key === 'Shift')
      ) return;
      setOpen(!open);
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
        <ListItem key="navHeader" disablePadding>
          <ListItemButton href="/account-settings">
            <AccountNav />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {features.map((f) => (
          <ListItem key={f.feature} disablePadding>
            <ListItemButton href={"/" + f.feature.toLowerCase().replace(" ", "-")}>
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
          open={open}
          onClose={toggleDrawer()}
      >
        {list()}
      </Drawer>
    </>
  );
}

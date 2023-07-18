import * as React from 'react';
import {useState} from 'react'
import {Stack, Box, Drawer, Button, List, Divider, ListItem, ListItemButton, ListItemIcon, SvgIcon} from '@mui/material'
import AvTimerIcon from '@mui/icons-material/AvTimer';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountNav from './AccountNav';
import SvgCanvas from '../../icons/SvgCanvas';
import LogoutIcon from '@mui/icons-material/Logout';

const features : {feature: string, app: JSX.Element}[] = [
  {feature: "Dashboard", app: <HomeIcon />},
  {feature: "Timer", app: <AvTimerIcon />},
  {feature: "Notes", app: <EditNoteRoundedIcon />}, 
  {feature: "Tasks", app: <FormatListBulletedIcon />},
  {feature: "Canvas Downloader", app: <SvgIcon><SvgCanvas /></SvgIcon>},
  {feature: "", app: <></>}, // divider
  {feature: "Account Settings", app: <ManageAccountsIcon />},
];

export default function NavSides({ onLogout } : { onLogout : React.MouseEventHandler<HTMLElement> }) {
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
          (f.feature !== "") ? (
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
          ) : <Divider sx={{ margin: ".5em" }} />
        ))}
        <ListItem key="logout" disablePadding>
          <ListItemButton onClick={ onLogout }>
            <ListItemIcon>
              <Stack direction='row' gap={5}>
                <LogoutIcon /> 
                Log out
              </Stack>
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
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

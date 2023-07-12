import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import supabase from '../../supabase';
import NavSides from './NavSides';
import AvatarView from '../AvatarView';
import { useWindowParams } from '../../hooks/useWindowParams';

const handleLogoutClick = () => {
  supabase.auth.signOut();
}

export default function NavigationBar({ title, children } : React.PropsWithChildren<{ title : string }> ) {
  
  const [ windowWidth, minimumDesktopWidth ] = useWindowParams();  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{padding: "0.5rem"}}>
          <NavSides />
          <Typography variant="h5" textAlign="center" component="code" className="todo-study-logo-white" sx={{ flexGrow: 1 }}>
            { title + ((windowWidth >= minimumDesktopWidth) ? " // TODO: Study" : "")}
          </Typography>
          <AvatarView />
          <Button variant="contained" onClick={handleLogoutClick} disableElevation>Sign out</Button>
        </Toolbar>
        { children }
      </AppBar>
    </Box>
  );
}
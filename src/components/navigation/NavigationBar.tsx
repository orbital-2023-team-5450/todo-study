import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import supabase from '../../supabase';
import NavSides from './NavSides';
import AvatarView from '../AvatarView';

const handleLogoutClick = () => {
  supabase.auth.signOut();
}

export default function NavigationBar({ title } : { title : string }) {
  
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth);

  useEffect(() => {

    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    }
  });
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{padding: "0.5rem"}}>
          <NavSides />
          <Typography variant="h5" component="code" className="todo-study-logo-white" sx={{ flexGrow: 1 }}>
            { title + ((windowWidth >= 600) ? " // TODO: Study" : "")}
          </Typography>
          <AvatarView />
          <Button variant="contained" onClick={handleLogoutClick} disableElevation>Sign out</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
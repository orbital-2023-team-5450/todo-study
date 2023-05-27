import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import supabase from '../supabase';
import Navsides from './navsides';

const handleLogoutClick = () => {
  supabase.auth.signOut();
}

export default function Bar({ title, avatarView } : { title : string, avatarView: JSX.Element }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{padding: "0.5rem"}}>
          <Navsides />
          <Typography variant="h5" component="code" className="todo-study-logo-white" sx={{ flexGrow: 1 }}>
            { title } // TODO: Study
          </Typography>
          { avatarView }
          <Button variant="contained" onClick={handleLogoutClick} disableElevation>Sign out</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
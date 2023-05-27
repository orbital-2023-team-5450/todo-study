import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { sign } from 'crypto';

export default function  Bar({nav, acc, signOut} : {nav: JSX.Element, acc: JSX.Element, signOut: JSX.Element}) {
  return (
    <Box sx={{ flexGrow: 1, padding: "1em"}}>
      <AppBar position="static">
        <Toolbar>
          {nav}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            //TODO Study
          </Typography>
          <Button color="inherit">{acc}</Button>
          <Button color="inherit">{signOut}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
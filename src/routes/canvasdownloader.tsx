import { Container, CssBaseline, Typography } from '@mui/material';
import React from 'react';
import NavigationBar from '../components/navigation/NavigationBar';
import LoadingScreen from '../components/LoadingScreen';

export default function CanvasDownloader() {
  return (
    <> 
      <CssBaseline />
      <NavigationBar title="Canvas Downloader" />
      <Container maxWidth="md">
        <Typography>Hello world!</Typography>
      </Container>
    </>
  );
}
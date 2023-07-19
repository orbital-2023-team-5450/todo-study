import { Button, Stack, Typography } from '@mui/material';
import React from 'react';

type CanvasDownloaderButtonProps = {
  step : number | string,
  title : string,
  onClick : React.MouseEventHandler<HTMLButtonElement>
}

export default function CanvasDownloaderButton({ step, title, onClick } : CanvasDownloaderButtonProps) {

  return (
    <Stack gap={2}>
      <Typography textAlign="center" variant="body2">Step { step.toString() }</Typography>
      <Button variant="contained" onClick={ onClick }>
        { title }
      </Button>
    </Stack>
  );
}
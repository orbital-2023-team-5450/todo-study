/**
 * A component encapsulating each Button in the settings toolbar
 * above the text editor (immediately above the horizontal rule).
 */

import React from 'react';
import { Grid, Tooltip, Button, Stack, Typography, ButtonPropsColorOverrides } from '@mui/material';

type GridItemButtonProps = {
  xs : number,
  sm : number,
  md : number,
  icon : React.ReactElement,
  label : string,
  onClick : React.MouseEventHandler<HTMLButtonElement>,
  tooltip? : string,
  color? : "primary" | "inherit" | "secondary" | "success" | "error" | "info" | "warning" | undefined
};

export default function GridItemButton({ xs, sm, md, icon, label, onClick, tooltip = "", color = "primary" } : GridItemButtonProps) {
  return (
    <Grid item xs={xs} sm={sm} md={md}>
      <Tooltip title={tooltip}>
        <Button sx={{ width: '100%' }} variant="contained" color={ color } onClick={ onClick }>
          <Stack spacing={1} direction="row">
            { icon }
            <Typography variant="button">{ label }</Typography>
          </Stack>
        </Button>
      </Tooltip>
    </Grid>
  );
}
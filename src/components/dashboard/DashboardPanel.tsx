import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type DashboardPanelProps = {
  children : React.ReactElement,
  title : string,
  href : string,
  onClick? : React.MouseEventHandler<HTMLButtonElement>,
  buttonTitle? : string,
};

export default function DashboardPanel({ children, title, href, onClick, buttonTitle } : DashboardPanelProps) {
  return (
    <Card>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={ title }
      />
      <CardContent sx={{ padding: '0 16px' }}>
        { children }
      </CardContent>
      <CardActions>
      {
        (href !== "") ? (
          <Button size="small" href={ href }>
            { buttonTitle ?? "Go to feature" }
          </Button>
        ) : (onClick !== null && buttonTitle !== null) ? (
          <Button size="small" onClick={ onClick }>
            { buttonTitle ?? "" }
          </Button>
        ) : <></> }
      </CardActions> 
    </Card>
  )
}
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import React from 'react';

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
      <CardContent>
        <Typography variant="h6" component="h1">
          { title }
        </Typography>
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
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type DashboardPanelProps = React.PropsWithChildren<{
  title : string,
  href : string,
  onClick? : React.MouseEventHandler<HTMLButtonElement>,
  onSettingsClick? : React.MouseEventHandler<HTMLButtonElement>
  buttonTitle? : string,
  tooltip? : string,
}>;

/**
 * A React component that represents a DashboardPanel, to be displayed as a Material UI card.
 * @param { DashboardPanelProps } props The props for this React component.
 * @param { React.ReactNode } props.children the child React elements to display within the content of the DashboardPanel.
 * @param { string } props.title The title of the DashboardPanel to be displayed on the card header.
 * @param { string } props.href  The URL that the bottom button will link to if the button behaves as a link anchor.
 * @param { React.MouseEventHandler<HTMLButtonElement> } props.onClick The click handler for the bottom button if the button behaves as a form button.
 * @param { React.MouseEventHandler<HTMLButtonElement> } props.onSettingsClick The click handler for the top settings button, as indicated by the more info icon. If undefined, the button will not be displayed.
 * @param { string } props.buttonTitle The text to be displayed in the bottom button, else a default text will be displayed (link anchor) or no button shows (form button).
 * @param { string } props.tooltip The text to be displayed as a tooltip for the top button, if it is present.
 */
export default function DashboardPanel({ children, title, href, onClick, onSettingsClick, buttonTitle, tooltip } : DashboardPanelProps) {
  return (
    <Card>
      <CardHeader
        action={ ( onSettingsClick !== undefined && onSettingsClick !== null ) ? (
          <Tooltip title={ tooltip ?? "" }>
            <IconButton aria-label="settings" onClick={ onSettingsClick }>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        ) : <></>
        }
        title={ title }
        sx={{ padding: '12px 16px 10px 16px' }}
      />
      <CardContent sx={{ padding: '0 16px' }}>
        { children }
      </CardContent>
      <CardActions>
      {
        (href !== "") ? (
          <Button sx={{ padding: '4px 8px' }} size="small" href={ href }>
            { buttonTitle ?? "Go to feature" }
          </Button>
        ) : (onClick !== null && onClick !== undefined && buttonTitle !== null && buttonTitle !== undefined) ? (
          <Button sx={{ padding: '4px 8px' }} size="small" onClick={ onClick }>
            { buttonTitle ?? "" }
          </Button>
        ) : <></> }
      </CardActions> 
    </Card>
  )
}
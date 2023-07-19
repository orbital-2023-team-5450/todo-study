import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

export default function CanvasTokenForm({ token, onChange, handleAccessTokenDone } : { token : string, onChange : React.ChangeEventHandler<HTMLInputElement>, handleAccessTokenDone : () => void}) {
  return (
    <Stack gap={2} mt={5} textAlign="left">
      <Typography component="h1" textAlign="center" variant="h4">Get your access token</Typography>
      <ol>
        <li><Typography>To get your Canvas token, log in to <Link href="https://canvas.nus.edu.sg">Canvas</Link>.</Typography></li>
        <li><Typography>Click on your avatar at the top left and click on the <strong>Settings</strong> link.</Typography></li>
        <li><Typography>Scroll down to the <strong>Approved integrations</strong> page and click on the <strong>New access token</strong> button.</Typography></li>
        <li><Typography>Generate an access token, putting the purpose as <code>// TODO: Study</code>.</Typography></li>
        <li><Typography>Copy the token and paste it in the textbox below. For security reasons, the token <strong>WILL NOT</strong> be stored in our database, so please store this token somewhere if you plan to use the feature multiple times (or you'll have to go back to Canvas and regenerate them as needed).</Typography></li>
      </ol>
      <TextField
        value={ token }
        onChange={ onChange }
        label="Your Canvas API token"
        type="password"
      />
      <Button variant="contained" onClick={ handleAccessTokenDone }>Done</Button>
    </Stack>
  )
}
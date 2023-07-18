import { Link, Stack, Typography } from '@mui/material';
import React from 'react';

export default function TelegramBotPanel() {
  return (
    <Stack gap={3}>
      <Typography>
        To use the Telegram bot, follow this <Link href="https://t.me/TODO_Study_bot">link</Link> or search <strong>@TODO_Study_bot</strong> on Telegram, then run the <code>/start</code> command.
      </Typography>
    </Stack>
  )
}
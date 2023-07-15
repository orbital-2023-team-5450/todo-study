import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

export type Quote = {
  content: string,
  author:  string,
}

export default function RandomQuotePanel({ quote } : { quote : Quote }) {

  return (
    <Typography>
      { quote.content }<br />
      &mdash; { quote.author }
    </Typography>
  )
}
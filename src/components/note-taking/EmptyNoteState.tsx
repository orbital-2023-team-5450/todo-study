import React from "react";
import { Typography, Box } from "@mui/material";

export default function EmptyNoteState({ width } : { width : (string | number)}) {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" width={width} paddingRight={0}>
            <Typography variant="h2" component="h1" textAlign="center">No editor loaded yet...</Typography>
        </Box>
    )
}
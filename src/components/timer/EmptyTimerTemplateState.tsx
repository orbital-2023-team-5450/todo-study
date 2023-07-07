import React from "react";
import { Typography, Box } from "@mui/material";

export default function EmptyTimerTemplateState() {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" paddingRight={0}>
            <Typography textAlign="center">No timer templates match your current search/filter specifications.</Typography>
        </Box>
    )
}
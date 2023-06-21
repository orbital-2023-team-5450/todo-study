import React from "react";
import { Box, CircularProgress } from "@mui/material";

/**
 * Contains a React component containing a loading screen, which includes a
 * circular progress bar (from Material UI) centred on the screen, which is
 * to be shown when a page is loading.
 * 
 * @returns A React component containing a loading screen.
 */
export default function LoadingScreen() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <CircularProgress size={120} />
        </Box>
    );
}
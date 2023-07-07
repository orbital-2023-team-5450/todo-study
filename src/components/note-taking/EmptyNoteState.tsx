import React from "react";
import { Typography, Box, Link } from "@mui/material";

export default function EmptyNoteState({ width, onLinkClick } : { width : (string | number), onLinkClick : () => void }) {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" width={width} padding={12}>
            <Box>
                <Typography variant="h3" component="h1" textAlign="center" marginBottom={3}>No editor loaded yet...</Typography>
                <Typography variant="h5" component="p" textAlign="center">
                    You can select an existing note using the navigation on the left, or <Link href="#" onClick={onLinkClick}>create a new note</Link>.
                </Typography>
            </Box>
        </Box>
    )
}
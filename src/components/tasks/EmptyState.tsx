import React from "react";
import { Typography } from "@mui/material";

/**
 * When there is no task in the task list, this will be shown.
 * 
 * @returns A line of text to inform the status of the list.  
 */
export default function EmptyState() {
    return (
        <Typography textAlign="center" variant="h6" component="h2" marginTop={5}> There isn't any task yet...</Typography>
    )
}
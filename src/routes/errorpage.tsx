import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ErrorPage({ error, errorDesc } : {error : string, errorDesc: string }) {
    
    document.title = "Error" + (error ? (": " + error) : "") + " // TODO: Study";
    
    return (
        <Container className="error-page" maxWidth="sm">
            <Stack component="main" gap={3}>
                <Typography variant="h3" fontWeight="bold" component="h1" sx={{fontFamily: "Inconsolata, monospace"}}>{"//"} TODO: Fix Error :(</Typography>
                <Typography component="p">The link you were expecting did not lead to anywhere. Return to the home page <Link to="/dashboard">here</Link>.</Typography>
                { 
                    error && 
                    <Typography component="p">
                        Here is some error information:<br /><Typography component="code">{ error + ": " + errorDesc }</Typography>
                    </Typography>
                }
            </Stack>
        </Container>
    );
}
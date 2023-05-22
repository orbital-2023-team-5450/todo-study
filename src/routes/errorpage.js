import { Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ErrorPage({ error, errorDesc }) {
    
    document.title = "Error" + (error ? (": " + error) : "");
    
    return (
        <Container className="error-page" maxWidth="sm">
            <Stack component="main" gap={2}>
                <Typography variant="h3" fontWeight="bold" component="h1">:(</Typography>
                <Typography variant="p" component="p">The link you were expecting did not lead to anywhere. Return to the home page <Link to="/dashboard">here</Link>.</Typography>
                { 
                    error && 
                    <Typography variant="p" component="p">
                        Here is some error information:<br /><Typography variant="code" component="code">{ error + ": " + errorDesc }</Typography>
                    </Typography>
                }
            </Stack>
        </Container>
    );
}
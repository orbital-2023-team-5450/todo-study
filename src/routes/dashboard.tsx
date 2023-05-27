import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, CssBaseline, Stack, Typography } from "@mui/material";
import supabase from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import Navsides from "../components/navsides";

export default function Dashboard() {

    document.title = "Dashboard // TODO: Study";

    const handleLogoutClick = () => {
        supabase.auth.signOut();
    }

    const [ username, setUsername ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    const features : string[] = ["timer", "reminder", "task"];

    const fetchInfo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
          
        supabase.from('users').select('user_name').eq("user_id", user_id).then((result) => {
            if (result.data === null || result.data === undefined || result.error) {
                alert("Error retrieving username!");
            } else if (result.data[0] === null || result.data[0] === undefined) {
                // user has not created account yet but has been directed to dashboard
                navigate("/create-account");
            } else {
                // user has created account
                setLoading(false);
                setUsername(result.data[0].user_name);
            }
        });
    }

    useEffect(() => {
        fetchInfo();
    }, [setUsername, setError]);

    return loading ? (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress size={120} />
            </Box>
        ) : (
            <> 
                <Typography variant="h3" component="h1" marginTop={5}>
                    { username === null ? "" : `Welcome back ${username}!`}
                </Typography>
                <Stack direction="row" gap={3} justifyContent="center" marginTop={5}>
                    <Navsides features={features} />
                    <Button variant="contained" onClick={handleLogoutClick}>Log out</Button>
                </Stack>
            </> 
        );
}
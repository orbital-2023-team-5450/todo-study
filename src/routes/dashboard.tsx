import React, { useState, useEffect } from "react";
import { Button, CssBaseline, Stack, Typography } from "@mui/material";
import supabase from "../supabase";
import { Link } from "react-router-dom";

export default function Dashboard() {

    document.title = "Dashboard // TODO: Study";

    const handleLogoutClick = () => {
        supabase.auth.signOut();
    }

    const [ username, setUsername ] = useState(null);
    const [ error, setError ] = useState(null);

    const fetchInfo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
          
        supabase.from('users').select('user_name').eq("user_id", user_id).then((result) => {
            if (result.data === null || result.error) {
                alert("Error retrieving username!");
            } else {
                setUsername(result.data[0].user_name);
            }
        });
    }

    useEffect(() => {
        fetchInfo();
    }, [setUsername, setError]);

    return (
        
        <>
            <Typography variant="h3" component="h1">
                { username === null ? "" : `Welcome back ${username}!`}
            </Typography>
            <Stack direction="row" gap={3}>
                <Button variant="contained"> <Link to="/timer"> timer </Link></Button>
                <Button variant="contained"> <Link to="/reminder"> reminder </Link></Button>
                <Button variant="contained"> <Link to="/task"> task </Link></Button>
                <Button variant="contained" onClick={handleLogoutClick}>Log out</Button>
            </Stack> 
        </>
    );
}
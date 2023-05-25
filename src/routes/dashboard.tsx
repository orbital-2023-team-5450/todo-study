import React from "react";
import { Button, CssBaseline, Stack, Typography } from "@mui/material";
import supabase from "../supabase";
import { Link } from "react-router-dom";

export default function Dashboard() {

    document.title = "Dashboard // TODO: Study";

    const handleLogoutClick = () => {
        supabase.auth.signOut();
    }

    return (
        
        <>
            <Typography variant="h3" component="h1">
                Welcome back!
            </Typography>
            <Stack direction="row" gap={3}>
                <Typography> <Link to="/timer"> timer </Link></Typography>
                <Typography> <Link to="/timer"> reminder </Link></Typography>
                <Typography> <Link to="/timer"> task </Link></Typography>
                <Button variant="contained" onClick={handleLogoutClick}>Log out</Button>
            </Stack>    
        </>
    );
}
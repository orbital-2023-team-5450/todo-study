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
                <Button variant="contained"> <Link to="/timer"> timer </Link></Button>
                <Button variant="contained"> <Link to="/reminder"> reminder </Link></Button>
                <Button variant="contained"> <Link to="/task"> task </Link></Button>
                <Button variant="contained" onClick={handleLogoutClick}>Log out</Button>
            </Stack> 
        </>
    );
}
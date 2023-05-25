import React from "react";
import { Button, Typography } from "@mui/material";
import supabase from "../supabase";

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
            <Button variant="contained" onClick={handleLogoutClick}>Log out</Button>
        </>
    );
}
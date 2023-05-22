import { Button, Typography } from "@mui/material";
import supabase from "../supabase";

export default function Home() {

    const handleLogoutClick = () => {
        supabase.auth.signOut();
    }

    return (
        <>
            <Typography variant="h3" component="h1">
                praise lord helix
            </Typography>
            <Button variant="contained" onClick={handleLogoutClick}>Log out</Button>
        </>
    );
}
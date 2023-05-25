import React from 'react';
import AccountSettings from '../components/accountsettings';
import { Button } from '@mui/material';
import supabase from '../supabase';

export default function CreateAccount() {

    document.title = "Create New Profile // TODO: Study";

    const handleLogoutClick = () => {
        supabase.auth.signOut();
    }

    return (
        <>
            <AccountSettings title="Create Account" />
            <Button variant="contained" onClick={handleLogoutClick}>Log out</Button>
        </>
    )
}
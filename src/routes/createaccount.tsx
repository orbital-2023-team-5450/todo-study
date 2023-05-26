import React from 'react';
import AccountSettings from '../components/accountsettings';
import { Button, Container, Stack, Typography } from '@mui/material';

export default function CreateAccount() {

    document.title = "Create New Profile // TODO: Study";

    return (
        <Container component="main" maxWidth="sm" sx={{"padding": "1em"}}>
            <AccountSettings title="Create Account" />
        </Container>
    )
}
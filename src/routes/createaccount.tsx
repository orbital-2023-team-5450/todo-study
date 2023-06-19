import React from 'react';
import AccountSettings from '../components/AccountSettings';
import { Container } from '@mui/material';

export default function CreateAccount() {

    document.title = "Create New Profile // TODO: Study";

    return (
        <Container component="main" maxWidth="sm" sx={{"padding": "1em"}}>
            <AccountSettings insert />
        </Container>
    )
}
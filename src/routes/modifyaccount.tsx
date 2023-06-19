import React from 'react';
import AccountSettings from '../components/AccountSettings';
import { Container } from '@mui/material';

export default function ModifyAccount() {

    document.title = "Update Account // TODO: Study";

    return (
        <Container component="main" maxWidth="sm" sx={{"padding": "1em"}}>
            <AccountSettings insert={false} />
        </Container>
    )
}
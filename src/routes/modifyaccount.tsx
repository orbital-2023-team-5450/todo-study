import React from 'react';
import AccountSettings from '../components/AccountSettings';
import { Container } from '@mui/material';

/**
 * Represents the page accessed by URL /account-settings in React Router. Contains the
 * account settings and customisation feature in // TODO: Study.
 * 
 * @returns A React component object representing the modify account page.
 */
export default function ModifyAccount({ onUpdate } : { onUpdate : () => void }) {

    document.title = "Update Account // TODO: Study";

    return (
        <Container component="main" maxWidth="sm" sx={{"padding": "1em"}}>
            <AccountSettings insert={false} onUpdate={ onUpdate } />
        </Container>
    )
}
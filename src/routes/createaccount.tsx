import React from 'react';
import AccountSettings from '../components/AccountSettings';
import { Container } from '@mui/material';

/**
 * Represents the page accessed by URL /create-account in React Router. Contains the
 * new account creation and customisation feature in // TODO: Study.
 * 
 * @returns A React component object representing the create account page.
 */
export default function CreateAccount({ onUpdate } : { onUpdate : () => void }) {

    document.title = "Create New Profile // TODO: Study";

    return (
        <Container component="main" maxWidth="sm" sx={{"padding": "1em"}}>
            <AccountSettings insert onUpdate={ onUpdate } />
        </Container>
    )
}
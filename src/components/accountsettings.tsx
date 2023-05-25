// account settings: for creation and editing of account settings
import React from 'react';
import { TextField, Container, Stack } from '@mui/material';

export default function AccountSettings({ title } : { title : string }) {
    return (
        <Container component="form">
            <Stack gap={3}>
                <TextField label="First Name" variant="outlined" />
                <TextField label="Last Name" variant="outlined" />
            </Stack>
        </Container>
    );
} 
import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import supabase from '../supabase';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Container, Stack, Typography } from '@mui/material';

export default function Login() {

    document.title = "Log in or sign up // TODO: Study";

    return (
        <Container maxWidth="sm"> 
            <Stack component="main" gap={3}>
                <Typography variant="h3" component="h1"><span className="todo-study-logo">{"//"} TODO: Study</span></Typography>
                <Typography variant="h4" component="h2">Log in or sign up</Typography>
                <Auth 
                    supabaseClient={supabase}
                    providers={['google']}
                    appearance={{ 
                        theme: ThemeSupa,
                        extend: true,
                        className: {
                            label: 'auth-text',
                            button: 'auth-text',
                            input: 'auth-text',
                            anchor: 'auth-text',

                        }
                    }}
                />    
            </Stack>
        </Container>
    );
}
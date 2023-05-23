import { Auth } from '@supabase/auth-ui-react';
import supabase from '../supabase';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Container, Typography } from '@mui/material';

export default function Login() {
    return (
        <Container maxWidth="sm"> 
            <Typography>Bla .... </Typography>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />  
        </Container>
    );
}
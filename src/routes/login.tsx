import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import supabase from '../supabase';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Button, Container, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import SvgGoogle from '../icons/googleicon';

export default function Login() {

    document.title = "Log in or sign up // TODO: Study";

    async function signInWithGoogle() {
        alert(process.env.REACT_APP_SITE_URL);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: process.env.REACT_APP_SITE_URL ?? "https://todo-study-orbital.vercel.app/" },
        })
    }

    return (
        <Container maxWidth="sm"> 
            <Stack component="main" gap={3}>
                <Typography variant="h3" component="h1"><span className="todo-study-logo">{"//"} TODO: Study</span></Typography>
                <Typography variant="h4" component="h2">Log in or sign up</Typography>
                <Auth 
                    supabaseClient={supabase}
                    providers={[]}
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
                <Divider light>
                    <Typography color="gray" sx={{paddingLeft: "1em", paddingRight: "1em", fontSize: "0.87rem"}}>
                        or you may also...
                    </Typography>
                </Divider>
                <Button variant="outlined" size="large" color="info" onClick={signInWithGoogle}>
                    <Stack gap={2} direction="row" alignItems="center">
                        <SvgGoogle />
                        <Typography sx={{fontSize: "inherit"}}>Sign in with Google</Typography>
                    </Stack>
                </Button>
            </Stack>
        </Container>
    );
}
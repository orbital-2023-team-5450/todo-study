import { Auth } from '@supabase/auth-ui-react';
import supabase from '../supabase';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Login() {
    return (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />  
    );
}
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.error('Login error:', error);
        redirect('/error');
    }

    redirect('/map');
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        console.error('Signup error:', error);
        redirect('/error');
    }

    redirect('/map');
}

export async function logout() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        redirect('/error');
    }

    redirect('/login');
}

/**
 * GitHubソーシャルログイン
 */
// export async function githubLogin() {
//     const supabase = createClient();

    

//     const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'github',
//         options: {
//             redirectTo: 'http://localhost:3000/map',
//         }
//     });

//     if (error) {

//         redirect('/error');
//     } else if (data?.url) {

//         // サーバー側でリダイレクトを行わないようにしてURLを返す
//         return { url: data.url };
//     }
 
// }

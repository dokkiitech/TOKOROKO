'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';

/**
 * ログイン
 */
export async function login(formData: FormData) {
    const supabase = createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    try {
        const { error } = await supabase.auth.signInWithPassword(data);
        if (error) {

            redirect('/error');
        }

        revalidatePath('/');
        redirect('/');
    } catch (e) {

        redirect('/error');
    }
}

/**
 * サインアップ
 */
export async function signup(formData: FormData) {
    const supabase = createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    try {
        const { error } = await supabase.auth.signUp(data);
        if (error) {

            redirect('/error');
        }

        revalidatePath('/');
        redirect('/');
    } catch (e) {

        redirect('/error');
    }
}

/**
 * GitHubソーシャルログイン
 */
export async function githubLogin() {
    const supabase = createClient();

    try {

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
        });

        if (error) {

            redirect('/error');
        } else if (data?.url) {

            // サーバー側でリダイレクトを行わないようにしてURLを返す
            return { url: data.url };
        }
    } catch (e) {

        redirect('/error');
    }
}

/**
 * ログアウト
 */
export async function logout() {
    const supabase = createClient();

    try {

        const { error } = await supabase.auth.signOut();

        if (error) {

            redirect('/error');
        }


        revalidatePath('/');
        redirect('/');
    } catch (e) {

        redirect('/error');
    }
}
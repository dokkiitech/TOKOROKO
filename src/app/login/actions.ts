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

  
    await supabase.auth.signInWithPassword(data);
    
   
    console.log('Login successful, redirecting to /map');
    redirect('/map');
   
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


    await supabase.auth.signUp(data);
      
    redirect('/map');
 
}

/**
 * GitHubソーシャルログイン
 */
export async function githubLogin() {
    const supabase = createClient();

    

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
    });

    if (error) {

        redirect('/error');
    } else if (data?.url) {

        // サーバー側でリダイレクトを行わないようにしてURLを返す
        return { url: data.url };
    }
 
}

/**
 * ログアウト
 */
export async function logout() {
    const supabase = createClient();

 

    await supabase.auth.signOut();

  


        
    redirect('/login');
  
}

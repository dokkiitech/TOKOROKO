import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL または ANON KEY が設定されていません。');
    }

    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

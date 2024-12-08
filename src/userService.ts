import { type Session, createClient } from '@supabase/supabase-js';

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export let session : Session | undefined = undefined;

export const init = async () => {
    const { data } = await supabase.auth.getSession() as any;
    session = data.session;
};

supabase.auth.onAuthStateChange((_, _session) => {
    session = _session as any;
});

export const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) {
        console.error('Error logging in with Google:', error.message);
        return;
    }
    console.log('User logged in:', data);
};

export const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
};
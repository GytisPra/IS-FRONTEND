import { type Session, UserResponse, createClient } from '@supabase/supabase-js';
import { router } from './router';

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export let session : Session | undefined = undefined;

//TODO: Maybe will be needed later on app init
// export const init = async () => {
//     const { data } = await supabase.auth.getSession() as any;
//     session = data.session;
// };

export const getSession = async () => {
    const { data } = await supabase.auth.getUser() as UserResponse;
    return data;
}

supabase.auth.onAuthStateChange((_, _session) => {
    session = _session as any;
});

export const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  
    if (error) {
      console.error('Error during Google Sign-In:', error.message);
    } else {
      console.log('Google Sign-In initiated.');
    }
  };
  

export const logout = async () => {
    await supabase.auth.signOut();
    router.navigate('/');
    window.location.reload();
};
import {supabase } from '../userService';

export const { data: {user}} = await supabase.auth.getUser()
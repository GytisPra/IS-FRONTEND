import { supabase } from "../../../supabase"

export const { data: { user } } = await supabase.auth.getUser()


// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Create a singleton Supabase client
//let supabaseClient = null;

export const createSupabaseClientWithClerk = (clerkAccessToken) => {
    
    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_KEY,
        {
            global: {
                headers: { Authorization: `Bearer ${clerkAccessToken}` },
            }
        }
    );

    return supabaseClient;
};


/*
const supabaseAccessToken = await session.getToken({
    template: 'supabase',
});
const supabase = await supabaseClient(supabaseAccessToken);

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  })
*/
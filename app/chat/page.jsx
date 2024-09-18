import { Chat } from 'components/chat.jsx'
import { createClient } from '@supabase/supabase-js'
import { SignedIn, SignedOut } from '@clerk/nextjs'


export const metadata = {
    title: 'Chat'
};

const explainer = `
This page contains the first draft of a chat page with OpenAI's ChatGPT
`;

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  })

  return supabase
}

export default function Page() {
    
    return (
        <main className="custom-grow">
            <section className="custom-grow">
                <SignedIn>
                    <Chat />
                </SignedIn>
                <SignedOut>
                    <p>Please Sign in on the authentication page to see the chat.</p>
                </SignedOut>
            </section>
        </main>
    );
}
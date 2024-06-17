import { Chat } from 'components/chat.jsx'
import { createClient } from '@supabase/supabase-js'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import '../../styles/chat.css';


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
        <main className="flex flex-col gap-8 sm:gap-16 grow">
            <section className="flex flex-col items-start gap-3 sm:gap-4 grow">
                <h1 className="mb-0">Chat</h1>
                <p className="text-lg">{"Let's chat!"}</p>
                <SignedIn>
                    <p>You are signed in! Here is the chat.</p>
                    <Chat />
                </SignedIn>
                <SignedOut>
                    <p>Please Sign in on the authentication page to see the chat.</p>
                </SignedOut>
            </section>
        </main>
    );
}
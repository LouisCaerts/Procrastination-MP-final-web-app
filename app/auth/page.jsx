import { Authentication } from 'components/authentication'
import { TodoListCombo } from 'components/todo-list';
import { createClient } from '@supabase/supabase-js'
import { SignedIn, SignedOut } from '@clerk/nextjs'


export const metadata = {
    title: 'Authentication'
};

const explainer = `
This page contains the login & registration functionality of the web app.
Users must be logged in in order to access the core of the app.
`;

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  })

  return supabase
}

export default function Page() {
    
    return (
        <main className="flex flex-col gap-8 sm:gap-16">
            <section className="flex flex-col items-start gap-3 sm:gap-4">
                <h1 className="mb-0">Authentication</h1>
                <p className="text-lg">{"Let's get you logged in!"}</p>
                <Authentication></Authentication>
                <SignedIn>
                    <p>You are signed in! Here is your todo list.</p>
                    <TodoListCombo />
                </SignedIn>
                <SignedOut>
                    <p>Please Sign in to see your todo list.</p>
                </SignedOut>
            </section>
        </main>
    );
}
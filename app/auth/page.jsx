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
        <main className="">
            <section className="">
                <h1>Authentication</h1>
                <Authentication />
                <SignedIn>
                    <p>You are signed in! Here is your todo list.</p>
                    <TodoListCombo />
                </SignedIn>
                <SignedOut>
                    <p>Signed out. Please return to the <a href="https://concrastination.netlify.app/">home page</a>.</p>
                </SignedOut>
            </section>
        </main>
    );
}
import { Chat } from 'components/chat.jsx'
import { SignedIn, SignedOut } from '@clerk/nextjs'


export const metadata = {
    title: 'Chat'
};

const explainer = `
This page contains the first draft of a chat page with OpenAI's ChatGPT
`;

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
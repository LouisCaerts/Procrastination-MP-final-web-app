import { Checkin } from 'components/checkin.jsx'
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
                    <Checkin />
                </SignedIn>
                <SignedOut>
                    <p>Signed out. Please return to the <a href="https://concrastination.netlify.app/">home page</a>.</p>
                </SignedOut>
            </section>
        </main>
    );
}
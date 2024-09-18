import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Identify } from 'components/identify.jsx'

export default function Page() {
    
    return (
        <main className="custom-grow">
            <section className="custom-grow">
                <SignedIn>
                    <Identify />
                </SignedIn>
                <SignedOut>
                    <p>Signed out. Please Sign in on the authentication page to see the chat.</p>
                </SignedOut>
            </section>
        </main>
    );
}
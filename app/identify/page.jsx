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
                    <p>Signed out. Please return to the <a href="https://concrastination.netlify.app/">home page</a>.</p>
                </SignedOut>
            </section>
        </main>
    );
}
"use client";
import { useAuth, useUser, UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'

const explainer = `
This page contains the login & registration functionality of the web app.
Users must be logged in in order to access the core of the app.
`;

export function Authentication() {
    const { isLoaded, isSignedIn, user } = useUser();
    return (
        <div>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    );
}
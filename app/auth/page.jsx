export const metadata = {
    title: 'Authentication'
};

const explainer = `
This page contains the login & registration functionality of the web app.
Users must be logged in in order to access the core of the app.
`;

export default function Page() {
    return (
        <main className="flex flex-col gap-8 sm:gap-16">
            <section className="flex flex-col items-start gap-3 sm:gap-4">
                <h1 className="mb-0">Authentication</h1>
                <p className="text-lg">Let\'s get you logged in!</p>
            </section>
        </main>
    );
}
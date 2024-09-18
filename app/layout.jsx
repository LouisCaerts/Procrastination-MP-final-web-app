import {ClerkProvider} from '@clerk/nextjs'
import '../styles/customs.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { DataProvider } from '../components/data-context';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
    title: {
        template: '%s | Netlify',
        default: 'Netlify Starter'
    }
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <DataProvider>
                <html lang="en" data-theme="lofi">
                    <head>
                        <meta charSet="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                        <link rel="icon" href="/favicon.svg" sizes="any" />
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossOrigin="anonymous"></link>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
                    </head>
                    <body className="fill-page custom-vertical-flex" data-new-gr-c-s-check-loaded="14.1082.0" data-gr-ext-installed="">
                        <div className="custom-grow">{children}</div>

                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossOrigin="anonymous" async></script>
                        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossOrigin="anonymous" async></script>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossOrigin="anonymous" async></script>
                        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous" async></script>
                    </body>
                </html>
            </DataProvider>
        </ClerkProvider>
    );
}

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="application-name" content="Otterhouse" />
                <meta name="apple-mobile-web-app-title" content="Otterhouse" />
                <meta name="description" content="Otterhouse - Your cozy gaming experience" />
                
                {/* Privacy and tracking preferences */}
                <meta name="robots" content="index, follow" />
                <meta httpEquiv="x-dns-prefetch-control" content="off" />
                <meta name="referrer" content="no-referrer" />
                
                {/* Open Graph / Social Media */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Otterhouse" />
                <meta property="og:title" content="Otterhouse" />
                <meta property="og:description" content="Your cozy gaming experience" />
                
                {/* Favicon */}
                <link rel="icon" href="/favicon.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

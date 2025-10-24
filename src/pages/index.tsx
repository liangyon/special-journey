import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import PasswordShield from "@/components/PasswordShield";

const inter = Inter({ subsets: ["latin"] });

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated
        const authenticated = localStorage.getItem('gameAuthenticated') === 'true';
        setIsAuthenticated(authenticated);
        setIsLoading(false);
    }, []);

    const handleAuthenticated = () => {
        setIsAuthenticated(true);
    };

    // Show loading state briefly to prevent flash
    if (isLoading) {
        return null;
    }

    return (
        <>
            <Head>
                <title>Otterhouse - Your Cozy Gaming Experience</title>
                <meta name="description" content="Welcome to Otterhouse - an immersive cozy gaming experience." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            {!isAuthenticated ? (
                <PasswordShield onAuthenticated={handleAuthenticated} />
            ) : (
                <main className={`${styles.main} ${inter.className}`}>
                    <AppWithoutSSR />
                </main>
            )}
        </>
    );
}

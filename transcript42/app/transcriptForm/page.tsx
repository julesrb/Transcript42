"use client";

import GoogleMap from "../components/GoogleMap";
import TranscriptForm from "../components/TranscriptForm";
import Footer from "../components/Footer";
import "../styles/transcript.css";

export default function TranscriptPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative bg-[#12141a]">
            <GoogleMap />

            <TranscriptForm />

            <Footer />

        </main>
    );
}

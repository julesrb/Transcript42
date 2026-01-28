"use client";

import GoogleMap from "./components/GoogleMap";
import LoginOverlay from "./components/LoginOverlay";
import Footer from "./components/Footer";
import "./home.css";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative bg-[#12141a]">
      <GoogleMap />

      <LoginOverlay />

      <Footer />
    </main>
  );
}

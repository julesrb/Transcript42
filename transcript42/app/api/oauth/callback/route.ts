// transcript42/api/oauth/callback/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function exchangeCodeForToken(code: string) {
    const authParams = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_FORTYTWO_UID || "",
        client_secret: process.env.FORTYTWO_SECRET || "",
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || ""
    });

    const response = await fetch(
        `https://api.intra.42.fr/oauth/token?${authParams.toString()}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    const data = await response.json();
    return data;
}

const sessions = new Map<string, {
    accessToken: string;
    expiresAt: number;
}>();

export async function saveSession(id: string, data: { accessToken: string; expiresAt: number }) {
    sessions.set(id, data);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return new Response("Missing code", { status: 400 });
    }

    const token = await exchangeCodeForToken(code);

    const sessionId = crypto.randomUUID();

    await saveSession(sessionId, {
        accessToken: token.access_token,
        expiresAt: Date.now() + token.expires_in * 1000,
    });

    const response = NextResponse.json({ auth_success: true });

    response.cookies.set("session", sessionId, {
        httpOnly: true,
        secure: false, // true = Cookie is only sent over HTTPS. DEV only
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10, // 10 minutes
    });

    return response;
}    
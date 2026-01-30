// transcript42/api/oauth/callback/route.ts

import { NextResponse } from "next/server";
import { exchangeCodeForToken } from "../../../lib/fortytwo";
import { encryptSession } from "../../../lib/session";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return new Response("Missing code", { status: 400 });
    }

    const token = await exchangeCodeForToken(code);

    const sessionId = await encryptSession({
        accessToken: token.access_token,
        expiresAt: Date.now() + token.expires_in * 1000,
    });

    const response = NextResponse.redirect(
        new URL("/transcriptForm", process.env.NEXT_PUBLIC_APP_URL)
    );

    response.cookies.set("session", sessionId, {
        httpOnly: true,
        secure: false, // true = Cookie is only sent over HTTPS. DEV only
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10, // 10 minutes
    });

    return response;
}
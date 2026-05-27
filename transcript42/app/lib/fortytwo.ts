export async function exchangeCodeForToken(code: string) {
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
    if (!response.ok) return null;
    const data = await response.json();
    return data;
}

export type GetUserInfoResult =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { ok: true; data: any }
    | { ok: false; reason: "unauthorized" | "error" };

export async function getUserInfo(token: string): Promise<GetUserInfoResult> {
    const response = await fetch(
        `https://api.intra.42.fr/v2/me`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }
    );
    if (response.status === 401 || response.status === 403) {
        return { ok: false, reason: "unauthorized" };
    }
    if (!response.ok) return { ok: false, reason: "error" };
    const data = await response.json();
    return { ok: true, data };
}


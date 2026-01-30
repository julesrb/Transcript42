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
    const data = await response.json();
    return data;
}

export async function getUserInfo(token: string) {
    const response = await fetch(
        `https://api.intra.42.fr/v2/me`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }
    );
    const data = await response.json();
    return data;
}


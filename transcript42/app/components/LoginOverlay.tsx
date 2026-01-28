export default function LoginOverlay() {
    const UID = process.env.NEXT_PUBLIC_FORTYTWO_UID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI;
    const AUTH_URL = "https://api.intra.42.fr/oauth/authorize";

    const loginParams = new URLSearchParams({
        client_id: UID || "",
        redirect_uri: REDIRECT_URI || "",
        response_type: "code",
        scope: "public",
    });

    const authUrl = `${AUTH_URL}?${loginParams.toString()}`;

    return (
        <div className="login-card max-w-[400px] w-full rounded-xl p-10 text-center relative z-10 flex flex-col items-center">
            <h1 className="m-0 leading-tight text-white text-[2.5rem] font-extrabold tracking-tight">
                42 Berlin
            </h1>
            <h2 className="mt-2 mb-8 leading-normal text-white/70 text-lg font-normal">
                Academic Transcript
            </h2>
            <a
                className="login-btn inline-block text-white px-7 py-3.5 rounded-lg text-base font-semibold no-underline"
                href={authUrl}
            >
                Login with 42
            </a>
        </div>
    );
}

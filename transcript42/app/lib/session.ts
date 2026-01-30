
export type SessionData = {
    accessToken: string;
    expiresAt: number;
};

export async function encryptSession(data: SessionData) {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}

export async function getSession(id: string): Promise<SessionData | undefined> {
    try {
        const decoded = Buffer.from(id, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    } catch {
        return undefined;
    }
}

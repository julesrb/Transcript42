
//TODO replace it with a coockie token 

const sessions = new Map<string, {
    accessToken: string;
    expiresAt: number;
}>();

export async function saveSession(id: string, data: { accessToken: string; expiresAt: number }) {
    sessions.set(id, data);
}

export async function getSession(id: string) {
    return sessions.get(id);
}

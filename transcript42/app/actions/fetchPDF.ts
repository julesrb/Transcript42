"use server";

import { cookies } from "next/headers";

type FormState = {
    success: boolean;
    message: string;
} | null;

export async function fetchPDF(prevState: FormState, formData: FormData): Promise<FormState> {

    const day = formData.get("dob_day") as string;
    const month = formData.get("dob_month") as string;
    const year = formData.get("dob_year") as string;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    const sessionId = sessionCookie?.value;

    if (!sessionId) {
        return {
            success: false,
            message: "No active session found. Please log in again.",
        };
    }

    const data = {
        session_id: sessionId,
        date_of_birth: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        location_of_birth: formData.get("location_of_birth"),
        language: formData.get("language"),
        transcript_type: formData.get("transcript_type"),
    };

    // Simulate some server-side processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        success: true,
        message: "Transcript generated successfully!",
    };
}

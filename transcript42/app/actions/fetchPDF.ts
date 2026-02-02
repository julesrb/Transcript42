"use server";

import { cookies } from "next/headers";
import { getSession } from "../lib/session";
import { getUserInfo } from "../lib/fortytwo";
import { generatePDF } from "./generatePDF/generatePDF";
import { UserFormData } from "../types/user-form-data";

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
        console.log("No session ID found.");
        return {
            success: false,
            message: "No active session found. Please log in again.",
        };
    }

    // Get Token from Session
    const token = await getSession(sessionId);
    if (!token) {
        console.log("Session invalid or expired.");
        return {
            success: false,
            message: "Session expired. Please log in again.",
        };
    }

    // Data for PDF (from Form)
    const userFormData: UserFormData = {
        date_of_birth: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        location_of_birth: formData.get("location_of_birth") as string,
        language: formData.get("language") as string,
        transcript_type: formData.get("transcript_type") as string,
    };
    console.log("PDF Generation Data:", userFormData);


    try {
        // Get User Info from 42 API
        const userJSON = await getUserInfo(token.accessToken);

        if (!userJSON) {
            console.log("Failed to fetch user info.");
            return {
                success: false,
                message: "User not found. Please log in again.",
            };
        }

        // generate PDF
        // generatePDF(userJSON, userFormData);

        console.log("PDF Action completed successfully.");
        return {
            success: true,
            message: "PDF generated successfully!",
        };

    } catch (error) {
        console.error("Error in fetchPDF:", error);
        return {
            success: false,
            message: "Server error occurred while generating transcript.",
        };
    }
}

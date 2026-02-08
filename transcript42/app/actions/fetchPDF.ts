"use server";

import { cookies } from "next/headers";
import { getSession } from "../lib/session";
import { getUserInfo } from "../lib/fortytwo";
import { generatePDF } from "./generatePDF/generatePDF";
import { UserFormData } from "../types/user-form-data";
import { logger } from "@/lib/logger";
import { auditAndLog } from "./audit";

type FormState = {
    success: boolean;
    message: string;
    pdfBase64?: string;
    fileName?: string;
} | null;

export async function fetchPDF(prevState: FormState, formData: FormData): Promise<FormState> {

    const ignoreDateOfBirth: boolean = formData.get("ignore_date_of_birth") === "true";
    const ignorePlaceOfBirth: boolean = formData.get("ignore_place_of_birth") === "true";

    const day = formData.get("dob_day") as string;
    const month = formData.get("dob_month") as string;
    const year = formData.get("dob_year") as string;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    const sessionId = sessionCookie?.value;

    if (!sessionId) {
        logger.warn("No session ID found.");
        return {
            success: false,
            message: "No active session found. Please log in again.",
        };
    }

    // Get Token from Session
    const token = await getSession(sessionId);
    if (!token) {
        logger.warn("Session invalid or expired.");
        return {
            success: false,
            message: "Session expired. Please log in again.",
        };
    }

    // Data for PDF (from Form)
    const userFormData: UserFormData = {
        date_of_birth: ignoreDateOfBirth ? undefined : `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`,
        location_of_birth: ignorePlaceOfBirth ? undefined : (formData.get("location_of_birth") as string),
        language: formData.get("language") as string,
        transcript_type: formData.get("transcript_type") as string,
    };
    logger.info("Starting PDF generation", { user_formData: userFormData });

    try {
        // Get User Info from 42 API
        const userJSON = await getUserInfo(token.accessToken);

        if (!userJSON) {
            logger.error("Failed to fetch user info from 42 API");
            return {
                success: false,
                message: "User not found. Please log in again.",
            };
        }

        // generate PDF
        const pdfResult = await generatePDF(userJSON, userFormData);

        if (!pdfResult.success || !pdfResult.pdfBase64) {
            return {
                success: false,
                message: pdfResult.message || "Failed to generate PDF.",
            };
        }

        // --- Background Audit & Stats (Non-blocking) ---
        auditAndLog(userJSON, userFormData, pdfResult.pdfBase64);

        logger.info("PDF generated successfully", {
            login: userJSON.login,
            type: userFormData.transcript_type
        });
        return {
            success: true,
            message: "PDF generated successfully! Starting download...",
            pdfBase64: pdfResult.pdfBase64,
            fileName: `Transcript_${userJSON.first_name}_${userJSON.last_name}.pdf`
        };

    } catch (error) {
        logger.error("Global error in fetchPDF", { error });
        return {
            success: false,
            message: "Server error occurred while generating transcript.",
        };
    }
}

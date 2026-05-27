"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { UserFormData } from "../types/user-form-data";
import { logger } from "@/lib/logger";

/**
 * Handles all background tasks:
 * 1. Tracking user usage & city stats
 * 2. Uploading PDF and JSON meta-data to storage
 * 3. Logging the generation event to the database
 */
export async function auditAndLog(userJSON: any, userFormData: UserFormData, pdfBase64: string) {
    try {
        // --- Primary Campus Detection ---
        const primaryCampusUser = userJSON.campus_users.find((cu: any) => cu.is_primary);
        const primaryCampusId = primaryCampusUser?.campus_id;
        const primaryCampus = userJSON.campus.find((c: any) => c.id === primaryCampusId);
        const campusName = primaryCampus?.name || 'Unknown';

        // --- Usage & City Data Tracking ---
        if (supabaseAdmin) {
            try {
                const { data: currentUsage } = await supabaseAdmin
                    .from('usage')
                    .select('value')
                    .eq('user_id', userJSON.id.toString())
                    .single();

                let isNewUser = !currentUsage;
                let newValue = currentUsage ? currentUsage.value + 1 : 1;

                await supabaseAdmin
                    .from('usage')
                    .upsert({
                        user_id: userJSON.id.toString(),
                        value: newValue,
                        campus: campusName,
                        last_used: new Date().toISOString()
                    });

                if (isNewUser && campusName !== 'Unknown') {
                    const { data: currentCity } = await supabaseAdmin
                        .from('city_data')
                        .select('value')
                        .eq('campus', campusName)
                        .single();

                    if (currentCity) {
                        // City exists, increment it
                        const newCityValue = currentCity.value + 1;
                        await supabaseAdmin
                            .from('city_data')
                            .update({
                                value: newCityValue,
                                updated_at: new Date().toISOString()
                            })
                            .eq('campus', campusName);
                    } else {
                        // New city, create it with defaults
                        await supabaseAdmin
                            .from('city_data')
                            .insert({
                                campus: campusName,
                                value: 1,
                                lat: 0,
                                lng: 0,
                                updated_at: new Date().toISOString()
                            });

                        logger.info("New campus added to city_data", { campus: campusName });
                    }
                }
            } catch (trackingError) {
                logger.error("Audit tracking error", { trackingError, userLogin: userJSON.login });
            }
        }

        // --- Storage & Audit Logging ---
        if (supabaseAdmin) {
            try {
                const timeStamp = Date.now();
                const fileName = `transcript_${userJSON.id}_${timeStamp}.pdf`;
                const jsonFileName = `transcript_${userJSON.id}_${timeStamp}.json`;
                const pdfBuffer = Buffer.from(pdfBase64, 'base64');
                const jsonBuffer = Buffer.from(JSON.stringify(userJSON, null, 2));

                const [pdfUpload, jsonUpload] = await Promise.all([
                    supabaseAdmin.storage
                        .from('transcript')
                        .upload(fileName, pdfBuffer, {
                            contentType: 'application/pdf',
                            upsert: true
                        }),
                    supabaseAdmin.storage
                        .from('transcript')
                        .upload(jsonFileName, jsonBuffer, {
                            contentType: 'application/json',
                            upsert: true
                        })
                ]);

                if (pdfUpload.error) {
                    logger.error("Failed to upload PDF to storage", { error: pdfUpload.error, fileName });
                } else {
                    logger.info("PDF uploaded to storage", { path: pdfUpload.data.path });
                }

                if (jsonUpload.error) {
                    logger.error("Failed to upload JSON to storage", { error: jsonUpload.error, jsonFileName });
                } else {
                    logger.info("JSON uploaded to storage", { path: jsonUpload.data.path });
                }

                const { error: insertError } = await supabaseAdmin
                    .from('pdf_gen_log')
                    .insert({
                        user_id: userJSON.id.toString(),
                        transcript_type: userFormData.transcript_type,
                        pdf_path: fileName,
                        json_path: jsonFileName,
                        location: campusName
                    });

                if (insertError) {
                    logger.error("Failed to insert into pdf_gen_log", { error: insertError });
                } else {
                    logger.info("Audit log inserted into pdf_gen_log");
                }

            } catch (logError) {
                logger.error("Audit logging error", { logError, userLogin: userJSON.login });
            }
        }

    } catch (err) {
        logger.error("Global audit error", { err, userLogin: userJSON?.login });
    }
}

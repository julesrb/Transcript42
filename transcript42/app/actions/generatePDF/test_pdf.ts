
import { generatePDF } from "./generatePDF";
import fs from "fs";
import path from "path";

async function main() {
    const jsonPath = path.join(__dirname, "user_test.json");
    console.log(`Reading user data from: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
        console.error("User JSON file not found!");
        return;
    }

    const userRawData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    const dummyFormData = {
        date_of_birth: "1990-01-01",
        location_of_birth: "Berlin, Germany",
        language: "English",
        transcript_type: "Official Transcript"
    };

    console.log("Generating PDF...");
    // @ts-ignore
    const result = await generatePDF(userRawData, dummyFormData);

    if (result.success && result.pdfBase64) {
        const buffer = Buffer.from(result.pdfBase64, 'base64');
        const outputPath = path.join(__dirname, "user_test_transcript.pdf");
        fs.writeFileSync(outputPath, buffer);
        console.log(`Success! PDF saved to: ${outputPath}`);
    } else {
        console.error("Failed:", result.message || "Unknown error");
    }
}

main().catch(console.error);

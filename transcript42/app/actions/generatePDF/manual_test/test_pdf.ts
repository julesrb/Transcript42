
import { generatePDF } from "../generatePDF";
import fs from "fs";
import path from "path";

async function main() {
    const testDir = path.join(__dirname, "test");
    const outputDir = path.join(__dirname, "test_output");


    // Recursively get all JSON files from test directory
    const getAllJsonFiles = (dir: string): string[] => {
        let results: string[] = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                results = results.concat(getAllJsonFiles(fullPath));
            } else if (item.endsWith('.json')) {
                results.push(fullPath);
            }
        }

        return results;
    };

    const jsonFiles = getAllJsonFiles(testDir);

    if (jsonFiles.length === 0) {
        console.error("No JSON files found in test directory!");
        return;
    }

    console.log(`Found ${jsonFiles.length} JSON files to process`);

    const dummyFormData = {
        date_of_birth: "01.02.2006",
        location_of_birth: "Berlin, Germany",
        language: "en",
        transcript_type: "core_advanced"
    };

    let successCount = 0;
    let failCount = 0;

    // Process each JSON file
    for (let i = 0; i < jsonFiles.length; i++) {
        const jsonPath = jsonFiles[i];
        const fileName = path.basename(jsonPath);
        const pdfFileName = fileName.replace('.json', '.pdf');
        const outputPath = path.join(outputDir, pdfFileName);

        console.log(`\n[${i + 1}/${jsonFiles.length}] Processing ${fileName}...`);

        try {
            const userRawData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

            // @ts-ignore
            const result = await generatePDF(userRawData, dummyFormData);

            if (result.success && result.pdfBase64) {
                const buffer = Buffer.from(result.pdfBase64, 'base64');
                fs.writeFileSync(outputPath, buffer);
                console.log(`✓ Success! PDF saved to: ${pdfFileName}`);
                successCount++;
            } else {
                console.error(`✗ Failed: ${result.message || "Unknown error"}`);
                failCount++;
            }
        } catch (error) {
            console.error(`✗ Error processing ${fileName}:`, error);
            failCount++;
        }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total files: ${jsonFiles.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

main().catch(console.error);

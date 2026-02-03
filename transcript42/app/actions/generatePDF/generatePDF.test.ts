/**
 * @jest-environment node
 */
import { generatePDF } from './generatePDF';
import path from 'path';
import fs from 'fs';
import { UserFormData } from '../../types/user-form-data';

// Mock console.log and console.error to keep test output clean
global.console = {
    ...console,
    // log: jest.fn(), 
    error: jest.fn(),
};

describe('generatePDF Action', () => {
    const testDataDir = path.join(__dirname, 'test');
    const outputDir = path.join(__dirname, 'test_output');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get all JSON files from the test directory
    const userFiles = fs.readdirSync(testDataDir).filter(file => file.endsWith('.json'));

    const dummyFormData: UserFormData = {
        date_of_birth: "1990-01-01",
        location_of_birth: "Test City, Test Country",
        language: "English",
        transcript_type: "Official Transcript"
    };

    // Run a test for each user file
    test.each(userFiles)('should generate PDF for %s', async (filename) => {
        const filePath = path.join(testDataDir, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const userRawData = JSON.parse(fileContent);

        const result = await generatePDF(userRawData, dummyFormData);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.pdfBase64).toBeDefined();
        expect(result.message).toBeUndefined();

        if (result.success && result.pdfBase64) {
            const buffer = Buffer.from(result.pdfBase64, 'base64');
            const outputTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputFilename = `${filename.replace('.json', '')}_${outputTimestamp}.pdf`;
            const outputPath = path.join(outputDir, outputFilename);

            fs.writeFileSync(outputPath, buffer);
        }
    });

    test('should fail with invalid data', async () => {
        const invalidData = { invalid: "data" };
        // @ts-ignore
        const result = await generatePDF(invalidData, dummyFormData);

        expect(result.success).toBe(false);
        expect(result.message).toBeDefined();
    })
});

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
    log: jest.fn(),
    error: jest.fn(),
};

describe('generatePDF Action', () => {

    const dummyFormData: UserFormData = {
        date_of_birth: "1990-01-01",
        location_of_birth: "Test, City",
        language: "en",
        transcript_type: "core_advanced"
    };

    test('should fail with invalid data', async () => {
        const invalidData = { invalid: "data" };
        // @ts-ignore
        const result = await generatePDF(invalidData, dummyFormData);

        expect(result.success).toBe(false);
        expect(result.message).toBeDefined();
    })
});

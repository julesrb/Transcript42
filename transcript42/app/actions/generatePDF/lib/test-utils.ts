import * as fs from 'fs';
import * as path from 'path';

/**
 * Loads a JSON fixture from the lib/__fixtures__ directory
 * @param libName The name of the library folder inside __fixtures__
 * @param fileName The name of the JSON file
 * @returns The parsed JSON data
 */
export const loadFixture = <T>(libName: string, fileName: string): T => {
    const fixturePath = path.join(__dirname, '__fixtures__', libName, fileName);

    if (!fs.existsSync(fixturePath)) {
        throw new Error(`Fixture not found at: ${fixturePath}`);
    }

    const content = fs.readFileSync(fixturePath, 'utf-8');
    return JSON.parse(content) as T;
};

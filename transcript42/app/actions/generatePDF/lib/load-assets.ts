import fs from "fs";
import path from "path";

export const getLogoBase64 = (projectRoot: string): string => {
    const logoPath = path.join(projectRoot, "assets/images/42_Logo.png");
    if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        return `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } else {
        console.error("Logo not found at:", logoPath);
        return '';
    }
}

import fs from "fs";
import path from "path";
import { logger } from "@/lib/logger";

export const getLogoBase64 = (projectRoot: string): string => {
    const logoPath = path.join(projectRoot, "assets/images/42_Logo.png");
    if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        return `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } else {
        logger.error("Logo not found", { path: logoPath });
        return '';
    }
}

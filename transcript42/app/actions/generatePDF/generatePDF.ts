"use server";

import { User, UserSchema } from "../../types/user";
import { UserFormData } from "../../types/user-form-data";
// @ts-ignore
import PdfPrinter from "pdfmake/js/Printer";
import path from "path";
import { structureProjectData } from "./lib/process-data";
import { getFonts } from "./styles/fonts";
import { getLogoBase64 } from "./lib/load-assets";
import { pdfStyles, defaultStyle } from "./styles/pdf-styles";
import { createHeader } from "./components/header";
import { getHeaderData } from "./lib/header-formatter";
import { createFooter } from "./components/footer";
import { createBackground } from "./components/background";
import { createProjectsTable } from "./components/projects-table";
import { createCurriculumDetails } from "./components/curriculum-details";
import { logger } from "@/lib/logger";

export type GeneratePDFResult = {
    success: boolean;
    pdfBase64?: string;
    message?: string;
};

export async function generatePDF(userRawData: any, userFormData: UserFormData): Promise<GeneratePDFResult> {
    // Determine project root based on current working directory
    let projectRoot: string;
    const cwd = process.cwd();

    if (cwd.includes("app/actions/generatePDF/manual_test")) {
        projectRoot = path.resolve(cwd, "../../../..");
    } else if (cwd.includes("app/actions/generatePDF")) {
        projectRoot = path.resolve(cwd, "../../..");
    } else {
        projectRoot = cwd;
    }

    // Validate User Info
    const userValidation = UserSchema.safeParse(userRawData);

    if (!userValidation.success) {
        logger.error(`User ${userRawData?.login} validation failed`, { error: userValidation.error.format() });
        return {
            success: false,
            message: "Invalid user data received from 42 API.",
        };
    }
    const userInfo: User = userValidation.data;

    // Process Data
    const { userCoreProjects, userAdvancedProjects } = structureProjectData(userInfo);
    const headerData = getHeaderData(userInfo, userFormData);

    const campus = userInfo.campus_users.find(c => c.is_primary);
    const campus_id = campus?.campus_id ?? 0;

    //generate PDF 
    try {
        const fonts = getFonts(projectRoot);
        const logoBase64 = getLogoBase64(projectRoot);
        const printer = new PdfPrinter(fonts);

        const coreTitle = userFormData.language === 'de' ? 'Kernstudium' : 'Core Curriculum';
        const advancedTitle = userFormData.language === 'de' ? 'Spezialisierung' : 'Specialization track';

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [30, 180, 30, 50],

            header: (currentPage: number, pageCount: number) =>
                createHeader(currentPage, pageCount, campus_id, headerData, logoBase64),

            footer: () =>
                createFooter(campus_id),

            background: (currentPage: number, pageSize: any) =>
                createBackground(pageSize),

            content: [
                ...createProjectsTable(userCoreProjects, coreTitle, userFormData.language, false),
                ...createCurriculumDetails(userFormData),
                ...(userFormData.transcript_type === 'core_advanced'
                    ? createProjectsTable(userAdvancedProjects, advancedTitle, userFormData.language, true)
                    : [])
            ],

            styles: pdfStyles,
            defaultStyle: defaultStyle
        };

        const pdfDoc = await printer.createPdfKitDocument(docDefinition);

        return new Promise((resolve) => {
            const chunks: any[] = [];
            pdfDoc.on('data', (chunk: any) => chunks.push(chunk));
            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                resolve({
                    success: true,
                    pdfBase64: result.toString('base64')
                });
            });
            pdfDoc.on('error', (err: any) => {
                logger.error("PDF generation error", { error: err });
                resolve({
                    success: false,
                    message: "Failed to generate PDF."
                });
            });
            pdfDoc.end();
        });

    } catch (error) {
        logger.error("PDF generation exception", { error });
        return {
            success: false,
            message: "An error occurred during PDF generation."
        };
    }
}
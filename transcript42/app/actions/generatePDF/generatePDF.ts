"use server";

import { User, UserSchema } from "../../types/user";
import { UserFormData } from "../../types/user-form-data";
import PdfPrinter from "pdfmake/js/Printer";
import fs from "fs";
import path from "path";
import coreProjectsData from "../../../data/core_projects.json";
import advancedProjectsData from "../../../data/advanced_projects.json";

export type GeneratePDFResult = {
    success: boolean;
    pdfBase64?: string;
    message?: string;
};

export async function generatePDF(userRawData: JSON, userFormData: UserFormData): Promise<GeneratePDFResult> {
    const projectRoot = process.cwd().includes("app/actions/generatePDF") ? path.resolve(process.cwd(), "../../..") : process.cwd();
    const fontsDir = path.join(projectRoot, "assets/fonts/Roboto");

    const fonts = {
        Roboto: {
            normal: path.join(fontsDir, "Roboto-Regular.ttf"),
            italics: path.join(fontsDir, "Roboto-Italic.ttf")
        },
        RobotoMedium: {
            normal: path.join(fontsDir, "Roboto-Medium.ttf"),
            italics: path.join(fontsDir, "Roboto-MediumItalic.ttf")
        },
        RobotoBold: {
            normal: path.join(fontsDir, "Roboto-Bold.ttf"),
            italics: path.join(fontsDir, "Roboto-BoldItalic.ttf")
        },
        RobotoBlack: {
            normal: path.join(fontsDir, "Roboto-Black.ttf"),
            italics: path.join(fontsDir, "Roboto-BlackItalic.ttf")
        }
    };

    // Validate User Info
    const userValidation = UserSchema.safeParse(userRawData);

    if (!userValidation.success) {
        console.error("User validation failed:", userValidation.error.format());
        return {
            success: false,
            message: "Invalid user data received from 42 API.",
        };
    }

    const userInfo: User = userValidation.data;

    // Filter finished projects
    const finishedProjects = userInfo.projects_users?.filter(p => p.status === "finished") || [];

    // Process Core Projects
    const userCoreProjects = [];
    for (const group of coreProjectsData) {
        const projectList = [];
        for (const [id, details] of Object.entries(group.projects)) {
            const userProject = finishedProjects.find(p => p.project.id.toString() === id);
            if (!userProject) continue;

            projectList.push({
                id,
                ...(typeof details === 'string' ? { name0: details } : details),
                final_mark: userProject.final_mark,
                cursus_ids: userProject.cursus_ids
            });
        }

        if (projectList.length > 0) {
            userCoreProjects.push({ groupName: group.groupName, projects: projectList });
        }
    }

    // Process Advanced Projects
    const userAdvancedProjects = [];
    for (const group of advancedProjectsData) {
        const projectList = [];
        for (const [id, details] of Object.entries(group.projects)) {
            const userProject = finishedProjects.find(p => p.project.id.toString() === id);
            if (!userProject) continue;

            projectList.push({
                id,
                ...(typeof details === 'string' ? { name0: details } : details),
                final_mark: userProject.final_mark,
                cursus_ids: userProject.cursus_ids
            });
        }

        if (projectList.length > 0) {
            userAdvancedProjects.push({ groupName: group.groupName, projects: projectList });
        }
    }

    console.log("Structured Core Projects:", JSON.stringify(userCoreProjects, null, 2));
    console.log("Structured Advanced Projects:", JSON.stringify(userAdvancedProjects, null, 2));

    //generate PDF 
    try {
        const projectRoot = process.cwd().includes("app/actions/generatePDF") ? path.resolve(process.cwd(), "../../..") : process.cwd();
        // Load images as base64
        const logoPath = path.join(projectRoot, "app/actions/generatePDF/42_Logo.png");

        let logoBase64 = '';

        // Load logo
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        } else {
            console.error("Logo not found at:", logoPath);
        }

        const printer = new PdfPrinter(fonts);

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [30, 180, 30, 50],

            header: (currentPage: number, pageCount: number) => {
                return {
                    stack: [
                        {
                            columns: [
                                {
                                    stack: [
                                        {
                                            columns: [
                                                {
                                                    image: logoBase64,
                                                    width: 80,
                                                    margin: [0, -10, 0, 0]
                                                },
                                                {
                                                    stack: [
                                                        { text: 'BERLIN', font: 'RobotoBlack', italics: true },
                                                        { text: 'Harzer Straße 39' },
                                                        { text: '12059 Berlin' },
                                                        { text: 'GERMANY' },
                                                    ],
                                                    margin: [5, 34, 0, 0]
                                                }
                                            ]
                                        },
                                        {
                                            stack: [
                                                { text: 'I, Daniel Hadley, Pedagogy Lead of 42 Berlin, certify that the above-named student has met academic requirements as of the date issued. This transcript is issued upon request for all official purposes.' },
                                            ],
                                            margin: [0, 7, 0, 0]
                                        }
                                    ],
                                    margin: [0, 0, 5, 0]

                                },
                                {
                                    stack: [
                                        { text: 'TRANSCRIPT OF ACADEMIC RECORDS', style: 'headerTitle' },
                                        {
                                            text: `${userInfo.first_name} ${userInfo.last_name}`.toUpperCase(),
                                            style: 'headerTitle'
                                        },
                                        {
                                            columns: [
                                                {
                                                    width: 170,
                                                    stack: [
                                                        { text: 'Date of birth:' },
                                                        { text: 'Location of birth:' },
                                                        { text: 'Date issued:' },
                                                        { text: 'Passed Selection in:' },
                                                        { text: 'Core Curriculum started on:' },
                                                        { text: 'Core Curriculum completed on:' },
                                                        { text: 'Specialization track complete on:' }
                                                    ]
                                                },
                                                {
                                                    stack: [
                                                        { text: userFormData.date_of_birth },
                                                        { text: userFormData.location_of_birth },
                                                        { text: Date.now().toString() },
                                                        { text: "..." },
                                                        { text: "..." },
                                                        { text: "..." },
                                                        { text: "..." }
                                                    ]
                                                }
                                            ],
                                            margin: [0, 10, 0, 0]
                                        }
                                    ],
                                    margin: [0, 0, 5, 0]
                                }
                            ]
                        },
                        {
                            text: `Page ${currentPage} / ${pageCount}`,
                            alignment: 'right'
                        }
                    ],
                    margin: [35, 24, 35, 0]
                };
            },

            footer: (currentPage: number, pageCount: number) => {
                return {
                    stack: [
                        {
                            text: 'www.42berlin.de – @42berlin\nEingetragener Verein, gemeinn\u00fctzig (equivalent to non-profit charity organisation)\nRegister No: VR 201961',
                            alignment: 'center',
                            style: 'footer'
                        }
                    ],
                    margin: [35, 10, 35, 0]
                };
            },

            background: function (currentPage: number, pageSize: any) {
                return {
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: pageSize.width,
                            h: pageSize.height,
                            color: '#daf5f9'
                        }
                    ]
                };
            },

            content: [
                { text: 'Core Curriculum', style: 'pageTitle', margin: [0, 0, 0, 10] },

                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Name', style: 'tableHeader' },
                                { text: 'Details', style: 'tableHeader' },
                                { text: 'Grade*', style: 'tableHeader', alignment: 'center' },
                                { text: 'Workload', style: 'tableHeader', alignment: 'center' }
                            ],
                            ...userCoreProjects.map((rank: any) => [
                                // Rank header row
                                [
                                    // { text: "", fillColor: '#e0e0e0' },
                                    { text: rank.groupName, colSpan: 4, style: 'rankHeader', fillColor: '#e0e0e0', font: 'RobotoBold' }

                                ],
                                // Project rows
                                ...rank.projects.map((p: any, idx: number) => [
                                    { text: p.name1, fillColor: '#f9f9f9' },
                                    { text: p.description_en, fillColor: '#f9f9f9' },
                                    { text: p.final_mark?.toString() || '0', fillColor: '#f9f9f9', alignment: 'center' },
                                    { text: p.hours, fillColor: '#f9f9f9', alignment: 'right' }
                                ])
                            ]).flat()
                        ]
                    },
                    layout: {
                        hLineWidth: () => 0,
                        vLineWidth: () => 0,
                        paddingLeft: () => 4,
                        paddingRight: () => 4,
                        paddingTop: () => 1,
                        paddingBottom: () => 1
                    }
                },
                { text: '*At 42, project grades are given on a scale from 0 to 100. A grade of 100 reflects full mastery of the project’s objectives. Exceptional submissions may receive a bonus, resulting in grades over 100. All evaluations are peer-reviewed and follow strict assessment criteria to ensure fairness and consistency.', style: 'note' },


                // Page 3: Advanced Projects (matching core projects style)
                userAdvancedProjects.length > 0 ? [
                    { text: '', pageBreak: 'before' },
                    { text: 'Specialization track', style: 'pageTitle', margin: [0, 0, 0, 10] },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['auto', '*', 'auto', 'auto'],
                            body: [
                                [
                                    { text: 'Name', style: 'tableHeader' },
                                    { text: 'Details', style: 'tableHeader' },
                                    { text: 'Grade*', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Workload', style: 'tableHeader', alignment: 'center' }
                                ],
                                ...userAdvancedProjects.map((category: any) => [
                                    // Category header row
                                    [
                                        { text: category.groupName, colSpan: 4, style: 'rankHeader', fillColor: '#e0e0e0', font: 'RobotoBold' }
                                    ],
                                    // Project rows
                                    ...category.projects.map((p: any, idx: number) => [
                                        { text: p.name1, fillColor: '#f9f9f9' },
                                        { text: p.description_en, fillColor: '#f9f9f9' },
                                        { text: p.final_mark?.toString() || '0', fillColor: '#f9f9f9', alignment: 'center' },
                                        { text: p.hours, fillColor: '#f9f9f9', alignment: 'right' }
                                    ])
                                ]).flat()
                            ]
                        },
                        layout: {
                            hLineWidth: () => 0,
                            vLineWidth: () => 0,
                            paddingLeft: () => 4,
                            paddingRight: () => 4,
                            paddingTop: () => 1.5,
                            paddingBottom: () => 1.5
                        }
                    }
                    , { text: '*At 42, project grades are given on a scale from 0 to 100. A grade of 100 reflects full mastery of the project’s objectives. Exceptional submissions may receive a bonus, resulting in grades over 100. All evaluations are peer-reviewed and follow strict assessment criteria to ensure fairness and consistency.', style: 'note' }
                ] : [],

                // Page 2: Placeholder content
                { text: '', pageBreak: 'before' },
                { text: 'Details of the Curriculum', style: 'pageTitle', margin: [0, 0, 0, 20] },
                {
                    text: 'This section is reserved for additional student information, achievements, and certifications.',
                    style: 'sectionHeader',
                    margin: [0, 0, 0, 10]
                },
                {
                    text: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
                        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n',
                        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
                        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n',
                        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, ',
                        'eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                    ],
                    fontSize: 10,
                    lineHeight: 1.5,
                    alignment: 'justify'
                },

            ],

            styles: {
                headerTitle: {
                    fontSize: 12,
                    font: 'RobotoBlack',
                    color: '#000000'
                },
                sectionHeader: {
                    fontSize: 14,
                    font: 'RobotoBold',
                    color: '#000000',
                    margin: [0, 10, 0, 8]
                },
                pageTitle: {
                    font: 'RobotoBold',
                    fontSize: 12,
                    alignment: 'center'
                },
                note: {
                    fontSize: 9.5,
                    italics: true,
                    margin: [0, 15, 0, 0]
                },
                footer: {
                    fontSize: 8
                },
                tableHeader: {
                    fontSize: 9.5,
                    font: 'RobotoBold',
                    fillColor: '#000000',
                    color: '#ffffff'
                }
            },

            defaultStyle: {
                font: 'Roboto',
                lineHeight: 1.1,
                fontSize: 9.5
            }
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
                console.error("PDF generation error:", err);
                resolve({
                    success: false,
                    message: "Failed to generate PDF."
                });
            });
            pdfDoc.end();
        });

    } catch (error) {
        console.error("PDF generation exception:", error);
        return {
            success: false,
            message: "An error occurred during PDF generation."
        };
    }
}
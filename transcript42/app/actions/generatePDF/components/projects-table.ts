export const createProjectsTable = (projects: any[], title: string, language: string = 'en', pageBreak = false) => {
    if (projects.length === 0) return [];

    const content: any[] = [];

    if (pageBreak) {
        content.push({ text: '', pageBreak: 'before' });
    }

    const headers = language === 'de'
        ? ['Name', 'Details', 'Note*', 'Aufwand']
        : ['Name', 'Details', 'Grade*', 'Workload'];

    const note = language === 'de'
        ? '*Bei 42 werden Projektnoten auf einer Skala von 0 bis 100 vergeben. Eine Note von 100 spiegelt die vollständige Beherrschung der Projektziele wider. Herausragende Leistungen können einen Bonus erhalten, was zu Noten über 100 führt. Alle Bewertungen sind peer-reviewed und folgen strengen Kriterien, um Fairness und Konsistenz zu gewährleisten.'
        : '*At 42, project grades are given on a scale from 0 to 100. A grade of 100 reflects full mastery of the project’s objectives. Exceptional submissions may receive a bonus, resulting in grades over 100. All evaluations are peer-reviewed and follow strict assessment criteria to ensure fairness and consistency.';

    content.push({ text: title, style: 'pageTitle', margin: [0, 0, 0, 10] });

    content.push({
        table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
                [
                    { text: headers[0], style: 'tableHeader' },
                    { text: headers[1], style: 'tableHeader' },
                    { text: headers[2], style: 'tableHeader', alignment: 'center' },
                    { text: headers[3], style: 'tableHeader', alignment: 'center' }
                ],
                ...projects.map((rank: any) => [
                    // Rank header row
                    [
                        { text: rank.groupName, colSpan: 4, style: 'rankHeader', fillColor: '#e0e0e0', font: 'RobotoBold' }
                    ],
                    // Project rows
                    ...rank.projects.map((p: any) => [
                        { text: p.name1, fillColor: '#f9f9f9' },
                        { text: language === 'de' ? (p.description_de || p.description_en) : p.description_en, fillColor: '#f9f9f9' },
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
    });

    content.push({ text: note, style: 'note' });

    return content;
};

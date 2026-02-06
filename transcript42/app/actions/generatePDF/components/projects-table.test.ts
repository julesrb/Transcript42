import { createProjectsTable } from './projects-table';

describe('projects-table createProjectsTable', () => {
    const mockProjects = [
        {
            groupName: 'rank 0',
            projects: [
                {
                    name1: 'Libft',
                    description_en: 'English description',
                    description_de: 'Deutsche Beschreibung',
                    final_mark: 100,
                    hours: '70 H'
                }
            ]
        }
    ];

    test('should use English description and headers when language is en', () => {
        const content = createProjectsTable(mockProjects, 'Core Curriculum', 'en');

        // Check for table content
        const table = content.find(item => item.table);
        expect(table).toBeDefined();

        const body = table.table.body;

        // Header row: Name, Details, Grade*, Workload
        expect(body[0][1].text).toBe('Details');
        expect(body[0][2].text).toBe('Grade*');

        // Project row: Index 2 because Index 0 is table header, Index 1 is rank header
        expect(body[2][1].text).toBe('English description');

        // Footer note
        const note = content.find(item => item.style === 'note');
        expect(note.text).toContain('*At 42');
    });

    test('should use German description and headers when language is de', () => {
        const content = createProjectsTable(mockProjects, 'Core Curriculum', 'de');

        const table = content.find(item => item.table);
        expect(table).toBeDefined();

        const body = table.table.body;

        // Header row: Name, Details, Note*, Aufwand
        expect(body[0][1].text).toBe('Details');
        expect(body[0][2].text).toBe('Note*');
        expect(body[0][3].text).toBe('Aufwand');

        // Project row
        expect(body[2][1].text).toBe('Deutsche Beschreibung');

        // Footer note
        const note = content.find(item => item.style === 'note');
        expect(note.text).toContain('*Bei 42');
    });

    test('should fallback to English description in German if German version is missing', () => {
        const missingDeProjects = [
            {
                groupName: 'rank 0',
                projects: [
                    {
                        name1: 'Libft',
                        description_en: 'English description',
                        final_mark: 100,
                        hours: '70 H'
                    }
                ]
            }
        ];

        const content = createProjectsTable(missingDeProjects, 'Core Curriculum', 'de');
        const table = content.find(item => item.table);
        const body = table.table.body;

        expect(body[2][1].text).toBe('English description');
    });
});

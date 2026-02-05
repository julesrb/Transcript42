import { structureProjectData } from './process-data';
import { User } from '../../../types/user';
import { loadFixture } from './test-utils';

describe('process-data structureProjectData', () => {

    const getProcessFixture = (fileName: string) => loadFixture<User>('process-data', fileName);

    test('should return at least one project if the user has validated projects tracked in our lists', () => {
        const userInfo = getProcessFixture('user_all_validated.json');
        const { userCoreProjects, userAdvancedProjects } = structureProjectData(userInfo);

        // At least one of the two should be non-empty
        const totalCore = userCoreProjects.reduce((acc, group) => acc + group.projects.length, 0);
        const totalAdvanced = userAdvancedProjects.reduce((acc, group) => acc + group.projects.length, 0);

        expect(totalCore + totalAdvanced).toBeGreaterThan(0);
        expect(userCoreProjects.length).toBeGreaterThan(0);
        expect(userAdvancedProjects.length).toBeGreaterThan(0);
    });

    test('should return empty arrays if user has no validated projects', () => {
        const userInfo = getProcessFixture('user_no_validated.json');
        const { userCoreProjects, userAdvancedProjects } = structureProjectData(userInfo);

        expect(userCoreProjects).toHaveLength(0);
        expect(userAdvancedProjects).toHaveLength(0);
    });

    test('should return empty arrays if user has no projects at all', () => {
        const userInfo = getProcessFixture('user_empty_projects.json');
        const { userCoreProjects, userAdvancedProjects } = structureProjectData(userInfo);

        expect(userCoreProjects).toHaveLength(0);
        expect(userAdvancedProjects).toHaveLength(0);
    });

    test('should correctly map project details from JSON files', () => {
        const userInfo = getProcessFixture('user_all_validated.json');
        const { userCoreProjects } = structureProjectData(userInfo);

        // Find Libft in the results
        const rank0 = userCoreProjects.find(g => g.groupName === 'rank 0');
        expect(rank0).toBeDefined();

        const libft = rank0?.projects.find(p => p.id === '1314');
        expect(libft).toBeDefined();
        expect(libft?.name0).toBe('Libft');
        expect(libft?.final_mark).toBe(100);
    });

    test('should log "lost" projects that are not in core, advanced, or ignored lists', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const userInfo: User = {
            login: 'testuser',
            projects_users: [
                {
                    'validated?': true,
                    final_mark: 100,
                    project: { id: 9999, name: 'Unknown Project' },
                    cursus_ids: [21]
                }
            ]
        } as any;

        structureProjectData(userInfo);

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[INFO] Lost projects found'),
            expect.objectContaining({
                login: 'testuser',
                lost_projects: expect.arrayContaining(['Unknown Project (ID: 9999)'])
            })
        );

        consoleSpy.mockRestore();
    });

    test('should not log projects that are in the ignored list', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // ID 159 is in ignored_projects.json
        const userInfo: User = {
            login: 'testuser',
            projects_users: [
                {
                    'validated?': true,
                    final_mark: 100,
                    project: { id: 159, name: 'Piscine C' },
                    cursus_ids: [21]
                }
            ]
        } as any;

        structureProjectData(userInfo);

        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});

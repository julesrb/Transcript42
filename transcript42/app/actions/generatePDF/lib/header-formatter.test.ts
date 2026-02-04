import { getHeaderData } from './header-formatter';
import { User } from '../../../types/user';
import { UserFormData } from '../../../types/user-form-data';
import { loadFixture } from './test-utils';

describe('header-formatter getHeaderData', () => {
    const dummyFormData: UserFormData = {
        date_of_birth: '01.02.1991',
        location_of_birth: 'Test City',
        language: 'en',
        transcript_type: 'core_advanced'
    };

    const getHeaderFixture = (fileName: string) => loadFixture<User>('header-formatter', fileName);

    // Case 1: No Cursus 21
    test('should return empty core dates if no cursus 21 is found', () => {
        const userInfo = getHeaderFixture('test_no_cursus_21.json');
        const result = getHeaderData(userInfo, dummyFormData);

        expect(result.core_start).toBe('');
        expect(result.core_end).toBe('');
    });

    // Case 2: Transcender but no core finish projects
    test('should return "in progress" for core_end if grade is Transcender but no target projects found', () => {
        const userInfo = getHeaderFixture('test_transcender_no_projects.json');
        const result = getHeaderData(userInfo, dummyFormData);

        expect(result.core_start).toBe('13.11.2023');
        expect(result.core_end).toBe('in progress');
    });

    test('should return "laufend" for core_end if language is de and user is a regular student', () => {
        const userInfo = getHeaderFixture('test_no_cursus_21.json'); // This will log an error but mainCursus will be null
        // Let's make a mock user with a regular cursus instead
        const regularUserInfo: User = {
            ...userInfo,
            cursus_users: [{ cursus_id: 21, grade: 'Learner', created_at: '2023-11-13T09:10:00.000Z' }] as any
        };
        const deFormData: UserFormData = { ...dummyFormData, language: 'de' };
        const result = getHeaderData(regularUserInfo, deFormData);

        expect(result.core_end).toBe('laufend');
    });

    test('should return "in progress" for core_end for a regular student in English', () => {
        const userInfo: User = {
            ...getHeaderFixture('test_no_cursus_21.json'),
            cursus_users: [{ cursus_id: 21, grade: 'Learner', created_at: '2023-11-13T09:10:00.000Z' }] as any
        };
        const result = getHeaderData(userInfo, dummyFormData);

        expect(result.core_end).toBe('in progress');
    });

    // Case 3: Transcender with core finish projects
    test('should return the latest project marked_at date for core_end if user is Transcender and has core projects', () => {
        const userInfo = getHeaderFixture('test_transcender_with_projects.json');
        const result = getHeaderData(userInfo, dummyFormData);

        expect(result.core_start).toBe('13.11.2023');
        // Latest date in test_transcender_with_projects.json is 2025-06-18
        expect(result.core_end).toBe('18.06.2025');
    });

    // Case 4: Alumni with core finish projects
    test('should return the project marked_at date for core_end if grade is Alumni and has core finish project', () => {
        const userInfo = getHeaderFixture('test_alumni_no_core_projects.json');
        const result = getHeaderData(userInfo, dummyFormData);

        expect(result.core_start).toBe('12.09.2022');
        expect(result.core_end).toBe('15.03.2024');
    });
});

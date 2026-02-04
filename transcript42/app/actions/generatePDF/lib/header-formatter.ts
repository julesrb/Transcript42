import { User } from "../../../types/user";
import { UserFormData } from "../../../types/user-form-data";

export interface HeaderData {
    language: string;
    advanced: boolean;
    date_issued: string;
    pool_date: string;
    core_start: string;
    core_end: string;
    specialization: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    locationOfBirth: string;
}

const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getLatestProjectDate = (projects: any[] | undefined, projectIds: number[]): string => {
    const relevantProjects = projects?.filter(pu =>
        projectIds.includes(pu.project.id) && pu.marked_at
    ) || [];

    if (relevantProjects.length === 0) return '';

    const latest = relevantProjects.reduce((prev, curr) =>
        new Date(curr.marked_at!) > new Date(prev.marked_at!) ? curr : prev
    );

    return formatDate(latest.marked_at);
};

export const getHeaderData = (userInfo: User, userFormData: UserFormData): HeaderData => {
    const language = userFormData.language;
    const advanced = userFormData.transcript_type === 'core_advanced';
    const IP_TEXT = language === 'en' ? 'in progress' : 'laufend';

    // 1. Basic Formatting
    const months: Record<string, string> = {
        january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
        july: "07", august: "08", september: "09", october: "10", november: "11", december: "12"
    };
    const pool_month_numeric = months[userInfo.pool_month.toLowerCase()] || userInfo.pool_month;
    const pool_date = `${pool_month_numeric} ${userInfo.pool_year}`;
    const date_issued = formatDate(new Date().toISOString());

    // 2. Cursus Logic
    const mainCursus = userInfo.cursus_users?.find(cu => cu.cursus_id === 21);
    if (!mainCursus) {
        console.error(`[HeaderFormatter] Error: Main 42cursus (ID 21) not found for user ${userInfo.login}.`);
    }

    const core_start = formatDate(mainCursus?.created_at);
    let core_end = '';

    if (mainCursus) {
        if (mainCursus.grade === 'Transcender') {
            const latestDate = getLatestProjectDate(userInfo.projects_users, [2623, 1324, 1337]);
            core_end = latestDate || IP_TEXT;

            if (!latestDate) {
                console.warn(`[HeaderFormatter] Warning: User ${userInfo.login} is Transcender but no core finish projects found. Falling back to "${IP_TEXT}".`);
            }
        } else {
            core_end = IP_TEXT;
        }
    }

    return {
        language,
        advanced,
        date_issued,
        pool_date,
        core_start,
        core_end,
        specialization: IP_TEXT,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        dateOfBirth: userFormData.date_of_birth,
        locationOfBirth: userFormData.location_of_birth
    };
};

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

export const getHeaderData = (userInfo: User, userFormData: UserFormData): HeaderData => {
    const language = userFormData.language;
    const advanced = userFormData.transcript_type === 'advanced' || userFormData.transcript_type === 'core_advanced';
    const date_issued = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const months: Record<string, string> = {
        january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
        july: "07", august: "08", september: "09", october: "10", november: "11", december: "12"
    };
    const pool_month_numeric = months[userInfo.pool_month.toLowerCase()] || userInfo.pool_month;
    const pool_date = `${pool_month_numeric} ${userInfo.pool_year}`;

    const mainCursus = userInfo.cursus_users?.find(cu => cu.cursus_id === 21);
    const core_start = mainCursus ? new Date(mainCursus.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

    // Find the latest marked_at date among specific core projects
    const coreFinishProjectIds = [2623, 1324, 1337];
    const coreProjects = userInfo.projects_users?.filter(pu =>
        coreFinishProjectIds.includes(pu.project.id) && pu.marked_at
    );

    let calculatedCoreEnd = '';
    if (coreProjects && coreProjects.length > 0) {
        const latestProject = coreProjects.reduce((latest, current) => {
            return new Date(current.marked_at!) > new Date(latest.marked_at!) ? current : latest;
        });
        calculatedCoreEnd = new Date(latestProject.marked_at!).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    const core_end = calculatedCoreEnd;
    const specialization = language === 'en' ? 'in progress' : 'laufend';

    return {
        language,
        advanced,
        date_issued,
        pool_date,
        core_start,
        core_end,
        specialization,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        dateOfBirth: userFormData.date_of_birth,
        locationOfBirth: userFormData.location_of_birth
    };
};

import { User } from "../../../types/user";
import coreProjectsData from "../data/core_projects.json";
import advancedProjectsData from "../data/advanced_projects.json";
import ignoredProjectsData from "../data/ignored_projects.json";
import { logger } from "@/lib/logger";

export const structureProjectData = (userInfo: User) => {
    // Filter finished projects
    const finishedProjects = userInfo.projects_users?.filter(p => p['validated?']) || [];

    // Process Core Projects
    const userCoreProjects = [];
    const assignedProjectIds = new Set<string>();

    for (const group of coreProjectsData) {
        const projectList = [];
        for (const [id, details] of Object.entries(group.projects)) {
            const userProject = finishedProjects.find(p => p.project.id.toString() === id);
            if (!userProject) continue;

            assignedProjectIds.add(id);
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

            assignedProjectIds.add(id);
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

    if (userAdvancedProjects.length > 0 && userCoreProjects.length < 3) {
        logger.warn(`User has advanced projects but less than 3 core projects`, { login: userInfo.login });
    }

    // Find Lost Projects (finished but not in core/advanced/ignored)
    const lostProjects = finishedProjects.filter(p => {
        const idStr = p.project.id.toString();
        return !assignedProjectIds.has(idStr) &&
            !Object.prototype.hasOwnProperty.call(ignoredProjectsData, idStr);
    });

    if (lostProjects.length > 0) {
        logger.info(`Lost projects found`, {
            login: userInfo.login,
            lost_projects: lostProjects.map(p => `${p.project.name} (ID: ${p.project.id})`)
        });
    }

    return { userCoreProjects, userAdvancedProjects };
};

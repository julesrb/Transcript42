import { User } from "../../../types/user";
import coreProjectsData from "../../../../data/core_projects.json";
import advancedProjectsData from "../../../../data/advanced_projects.json";

export const structureProjectData = (userInfo: User) => {
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

    return { userCoreProjects, userAdvancedProjects };
};

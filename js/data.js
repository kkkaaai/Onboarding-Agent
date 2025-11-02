// Hardcoded configuration data for Raspberry Coffee onboarding system

export const PROJECTS = {
    aurora: {
        id: 'aurora',
        name: 'Aurora Design System',
        description: 'Next-generation design and component framework',
        githubRepos: [
            {
                name: 'aurora-design-system',
                url: 'https://github.com/JieHan-eng/aurora-design-system'
            }
        ],
        slackChannels: ['#design-system', '#onboarding', '#ux-team'],
        availableRoles: ['Design System Intern', 'Frontend Engineer', 'UX Designer']
    },
    nova: {
        id: 'nova',
        name: 'Project Nova',
        description: 'Raspberry Handheld 4 & Bloom OS 4.0 development',
        githubRepos: [
            {
                name: 'raspberry-handheld-4',
                url: 'https://github.com/raspberry-coffee/handheld-4'
            },
            {
                name: 'bloom-os',
                url: 'https://github.com/raspberry-coffee/bloom-os'
            }
        ],
        slackChannels: ['#project-nova', '#onboarding', '#engineering'],
        availableRoles: ['Software Engineer', 'Product Manager', 'QA Engineer']
    },
    customer360: {
        id: 'customer360',
        name: 'Customer 360',
        description: 'Data platform for analytics and customer insights',
        githubRepos: [
            {
                name: 'customer-360-platform',
                url: 'https://github.com/raspberry-coffee/customer-360'
            }
        ],
        slackChannels: ['#customer-360', '#onboarding', '#data-team'],
        availableRoles: ['Data Engineer', 'Analytics Engineer', 'ML Engineer']
    }
};

export const ROLES = {
    'Design System Intern': {
        title: 'Design System Intern',
        department: 'Product',
        team: 'UX Team',
        manager: 'Rania Boutros',
        managerEmail: 'rania.boutros@raspberry-coffee.com',
        additionalChannels: ['#frontend'],
        description: 'Implement component variants, maintain design tokens, run accessibility tests'
    },
    'Frontend Engineer': {
        title: 'Frontend Engineer',
        department: 'Engineering',
        team: 'Application Engineering',
        manager: 'Priya Nair',
        managerEmail: 'priya.nair@raspberry-coffee.com',
        additionalChannels: ['#frontend', '#engineering'],
        description: 'Build and maintain frontend applications'
    },
    'UX Designer': {
        title: 'UX Designer',
        department: 'Product',
        team: 'UX Team',
        manager: 'Rania Boutros',
        managerEmail: 'rania.boutros@raspberry-coffee.com',
        additionalChannels: ['#product'],
        description: 'Design user interfaces and experiences'
    },
    'Software Engineer': {
        title: 'Software Engineer',
        department: 'Engineering',
        team: 'Application Engineering',
        manager: 'Priya Nair',
        managerEmail: 'priya.nair@raspberry-coffee.com',
        additionalChannels: ['#engineering', '#platform'],
        description: 'Develop and maintain software systems'
    },
    'Product Manager': {
        title: 'Product Manager',
        department: 'Product',
        team: 'Product Management',
        manager: 'Lena Müller',
        managerEmail: 'lena.mueller@raspberry-coffee.com',
        additionalChannels: ['#product', '#engineering'],
        description: 'Define product strategy and roadmap'
    },
    'QA Engineer': {
        title: 'QA Engineer',
        department: 'Engineering',
        team: 'Application Engineering',
        manager: 'Priya Nair',
        managerEmail: 'priya.nair@raspberry-coffee.com',
        additionalChannels: ['#engineering', '#qa'],
        description: 'Ensure quality through testing and automation'
    },
    'Data Engineer': {
        title: 'Data Engineer',
        department: 'Engineering',
        team: 'Data & Analytics',
        manager: 'George Williams',
        managerEmail: 'george.williams@raspberry-coffee.com',
        additionalChannels: ['#data-team', '#engineering'],
        description: 'Build and maintain data pipelines'
    },
    'Analytics Engineer': {
        title: 'Analytics Engineer',
        department: 'Engineering',
        team: 'Data & Analytics',
        manager: 'George Williams',
        managerEmail: 'george.williams@raspberry-coffee.com',
        additionalChannels: ['#data-team'],
        description: 'Transform data for business intelligence'
    },
    'ML Engineer': {
        title: 'ML Engineer',
        department: 'Engineering',
        team: 'Data & Analytics',
        manager: 'George Williams',
        managerEmail: 'george.williams@raspberry-coffee.com',
        additionalChannels: ['#data-team', '#ml'],
        description: 'Develop machine learning models and systems'
    }
};

// Helper functions
export function getProjectById(projectId) {
    return PROJECTS[projectId] || null;
}

export function getRoleInfo(roleTitle) {
    return ROLES[roleTitle] || null;
}

export function getProjectOptions() {
    return Object.values(PROJECTS).map(project => ({
        value: project.id,
        label: project.name,
        description: project.description
    }));
}

export function getRoleOptionsForProject(projectId) {
    const project = PROJECTS[projectId];
    if (!project) return [];
    
    return project.availableRoles.map(role => ({
        value: role,
        label: role,
        description: ROLES[role]?.description || ''
    }));
}

export function getAllSlackChannelsForEmployee(projectId, roleTitle) {
    const project = PROJECTS[projectId];
    const role = ROLES[roleTitle];
    
    if (!project || !role) return [];
    
    // Combine project channels and role-specific channels, remove duplicates
    const channels = [
        ...project.slackChannels,
        ...(role.additionalChannels || [])
    ];
    
    return [...new Set(channels)];
}

export function getOnboardingData(projectId, roleTitle) {
    const project = PROJECTS[projectId];
    const role = ROLES[roleTitle];
    
    if (!project || !role) return null;
    
    return {
        project: {
            name: project.name,
            description: project.description,
            repos: project.githubRepos
        },
        role: {
            title: role.title,
            department: role.department,
            team: role.team,
            manager: role.manager,
            managerEmail: role.managerEmail
        },
        slack: {
            channels: getAllSlackChannelsForEmployee(projectId, roleTitle)
        },
        github: {
            repos: project.githubRepos
        }
    };
}



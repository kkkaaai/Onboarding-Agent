import { PROJECTS, ROLES, getProjectOptions, getRoleOptionsForProject, getOnboardingData } from './data.js';

// DOM Elements
const form = document.getElementById('onboarding-form');
const formContainer = document.getElementById('form-container');
const progressContainer = document.getElementById('progress-container');
const successContainer = document.getElementById('success-container');

const projectSelect = document.getElementById('project');
const projectDescription = document.getElementById('project-description');
const roleSelect = document.getElementById('role');
const roleDescription = document.getElementById('role-description');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateProjectDropdown();
    setupEventListeners();
});

// Populate Project Dropdown
function populateProjectDropdown() {
    const projects = getProjectOptions();
    
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.value;
        option.textContent = project.label;
        option.dataset.description = project.description;
        projectSelect.appendChild(option);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Project selection changes
    projectSelect.addEventListener('change', (e) => {
        const selectedProject = e.target.value;
        const selectedOption = e.target.options[e.target.selectedIndex];
        
        if (selectedProject) {
            // Show project description
            projectDescription.textContent = selectedOption.dataset.description;
            
            // Enable and populate role dropdown
            roleSelect.disabled = false;
            populateRoleDropdown(selectedProject);
        } else {
            projectDescription.textContent = '';
            roleSelect.disabled = true;
            roleSelect.innerHTML = '<option value="">Select a project first...</option>';
            roleDescription.textContent = '';
        }
    });

    // Role selection changes
    roleSelect.addEventListener('change', (e) => {
        const selectedRole = e.target.value;
        const selectedOption = e.target.options[e.target.selectedIndex];
        
        if (selectedRole) {
            roleDescription.textContent = selectedOption.dataset.description;
        } else {
            roleDescription.textContent = '';
        }
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

// Populate Role Dropdown based on selected project
function populateRoleDropdown(projectId) {
    const roles = getRoleOptionsForProject(projectId);
    
    roleSelect.innerHTML = '<option value="">Select a role...</option>';
    
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.value;
        option.textContent = role.label;
        option.dataset.description = role.description;
        roleSelect.appendChild(option);
    });
    
    roleDescription.textContent = '';
}

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        project: projectSelect.value,
        role: roleSelect.value
    };

    // Validate
    if (!formData.name || !formData.email || !formData.password || !formData.project || !formData.role) {
        alert('Please fill in all required fields');
        return;
    }

    // Get onboarding data
    const onboardingData = getOnboardingData(formData.project, formData.role);
    
    if (!onboardingData) {
        alert('Error: Could not retrieve onboarding configuration');
        return;
    }

    // Store employee data
    const employeeData = {
        ...formData,
        onboardingData,
        onboardedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('currentEmployee', JSON.stringify(employeeData));
    localStorage.setItem(`employee_${formData.email}`, JSON.stringify(employeeData));

    // Start onboarding process
    await startOnboardingProcess(employeeData);
}

// Start Onboarding Process (Fake)
async function startOnboardingProcess(employeeData) {
    // Hide form, show progress
    formContainer.style.display = 'none';
    progressContainer.style.display = 'block';

    // Define steps
    const steps = [
        { key: 'profile', duration: 1200 },
        { key: 'slack', duration: 1500 },
        { key: 'github', duration: 1300 },
        { key: 'chatbot', duration: 1000 }
    ];

    // Execute steps sequentially
    for (const step of steps) {
        await executeStep(step.key, step.duration);
    }

    // Show success
    await new Promise(resolve => setTimeout(resolve, 500));
    showSuccess(employeeData);
}

// Execute a single onboarding step
function executeStep(stepKey, duration) {
    return new Promise(resolve => {
        const stepElement = document.querySelector(`[data-step="${stepKey}"]`);
        
        // Mark as active
        stepElement.classList.add('active');
        
        // After duration, mark as completed
        setTimeout(() => {
            stepElement.classList.remove('active');
            stepElement.classList.add('completed');
            resolve();
        }, duration);
    });
}

// Show Success Screen
function showSuccess(employeeData) {
    const { name, onboardingData } = employeeData;
    
    // Hide progress, show success
    progressContainer.style.display = 'none';
    successContainer.style.display = 'block';

    // Display employee name
    document.getElementById('employee-name-display').textContent = name;

    // Display Slack channels
    const slackChannelsList = document.getElementById('slack-channels-list');
    slackChannelsList.innerHTML = '';
    onboardingData.slack.channels.forEach(channel => {
        const item = document.createElement('div');
        item.className = 'detail-item channel';
        item.textContent = channel;
        slackChannelsList.appendChild(item);
    });

    // Display GitHub repos
    const githubReposList = document.getElementById('github-repos-list');
    githubReposList.innerHTML = '';
    onboardingData.github.repos.forEach(repo => {
        const item = document.createElement('div');
        item.className = 'detail-item repo';
        item.textContent = repo.name;
        githubReposList.appendChild(item);
    });

    // Display manager info
    const managerInfo = document.getElementById('manager-info');
    managerInfo.innerHTML = '';
    const managerItem = document.createElement('div');
    managerItem.className = 'detail-item';
    managerItem.textContent = `${onboardingData.role.manager} (${onboardingData.role.team})`;
    managerInfo.appendChild(managerItem);

    const emailItem = document.createElement('div');
    emailItem.className = 'detail-item';
    emailItem.textContent = onboardingData.role.managerEmail;
    emailItem.style.fontFamily = 'monospace';
    emailItem.style.fontSize = '13px';
    managerInfo.appendChild(emailItem);
}



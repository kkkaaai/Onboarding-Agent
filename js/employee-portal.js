// Employee Portal JavaScript

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const chatInterface = document.getElementById('chat-interface');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

const avatarModeBtn = document.getElementById('avatar-mode-btn');
const textModeBtn = document.getElementById('text-mode-btn');
const avatarModeContainer = document.getElementById('avatar-mode-container');
const textModeContainer = document.getElementById('text-mode-container');

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const logoutBtn = document.getElementById('logout-btn');

let currentEmployee = null;
let currentMode = 'avatar';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
        currentEmployee = JSON.parse(storedEmployee);
        showChatInterface();
    }

    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    avatarModeBtn.addEventListener('click', () => switchMode('avatar'));
    textModeBtn.addEventListener('click', () => switchMode('text'));
    chatForm.addEventListener('submit', handleChatSubmit);
    logoutBtn.addEventListener('click', handleLogout);
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();

    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value;

    // Try to find employee in localStorage
    const currentEmp = localStorage.getItem('currentEmployee');
    
    if (currentEmp) {
        const empData = JSON.parse(currentEmp);
        
        // Simple validation
        if (empData.name.toLowerCase() === name.toLowerCase() && empData.password === password) {
            currentEmployee = empData;
            localStorage.setItem('loggedInEmployee', JSON.stringify(empData));
            showChatInterface();
            return;
        }
    }

    // Show error
    loginError.style.display = 'block';
    loginError.textContent = 'Invalid credentials. Please check your name and password.';
    
    // Hide error after 3 seconds
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 3000);
}

// Show Chat Interface
function showChatInterface() {
    loginScreen.style.display = 'none';
    chatInterface.style.display = 'flex';

    // Display user info
    displayUserInfo();
    
    // Display onboarding summary
    displayOnboardingSummary();

    // Add welcome message to text mode
    addWelcomeMessage();
}

// Display User Info in Header
function displayUserInfo() {
    const initials = currentEmployee.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    document.getElementById('user-initials').textContent = initials;
    document.getElementById('user-name-display').textContent = currentEmployee.name;
    document.getElementById('user-role-display').textContent = currentEmployee.role;
}

// Display Onboarding Summary
function displayOnboardingSummary() {
    const { onboardingData } = currentEmployee;
    
    // Avatar mode summary
    const avatarSummary = document.getElementById('onboarding-summary');
    avatarSummary.innerHTML = createSummaryHTML(onboardingData);

    // Text mode summary
    const textSummary = document.getElementById('text-onboarding-summary');
    textSummary.innerHTML = createSummaryHTML(onboardingData);
}

function createSummaryHTML(data) {
    const slackChannels = data.slack.channels.map(ch => 
        `<span class="summary-tag">${ch}</span>`
    ).join('');

    const repos = data.github.repos.map(repo => 
        `<span class="summary-tag">${repo.name}</span>`
    ).join('');

    return `
        <div class="summary-item">
            <svg class="summary-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
            <div>
                <div class="summary-label">Slack Channels:</div>
                <div class="summary-list">${slackChannels}</div>
            </div>
        </div>
        <div class="summary-item">
            <svg class="summary-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
            <div>
                <div class="summary-label">GitHub Repos:</div>
                <div class="summary-list">${repos}</div>
            </div>
        </div>
        <div class="summary-item">
            <svg class="summary-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
            <div>
                <div class="summary-label">Manager:</div>
                <div class="summary-value">${data.role.manager} (${data.role.team})</div>
            </div>
        </div>
    `;
}

// Switch Mode
function switchMode(mode) {
    if (mode === currentMode) return;

    currentMode = mode;

    if (mode === 'avatar') {
        avatarModeBtn.classList.add('active');
        textModeBtn.classList.remove('active');
        avatarModeContainer.classList.add('active');
        textModeContainer.classList.remove('active');
    } else {
        textModeBtn.classList.add('active');
        avatarModeBtn.classList.remove('active');
        textModeContainer.classList.add('active');
        avatarModeContainer.classList.remove('active');
    }
}

// Add Welcome Message
function addWelcomeMessage() {
    const { onboardingData, name } = currentEmployee;
    const channels = onboardingData.slack.channels.join(', ');
    const repos = onboardingData.github.repos.map(r => r.name).join(', ');

    const welcomeText = `Welcome ${name}! 🎉 You've been successfully onboarded to Raspberry Coffee.\n\nHere's what's been set up for you:\n\n• Slack channels: ${channels}\n• GitHub repositories: ${repos}\n• Manager: ${onboardingData.role.manager}\n\nI'm here to help you with any questions about your onboarding, the company, your project, or your role. What would you like to know?`;

    setTimeout(() => {
        addMessage('assistant', welcomeText);
    }, 500);
}

// Handle Chat Submit
async function handleChatSubmit(e) {
    e.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage('user', message);
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Hide typing indicator
    hideTypingIndicator();

    // Generate and add response
    const response = generateResponse(message);
    addMessage('assistant', response);
}

// Add Message to Chat
function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (type === 'assistant') {
        avatarDiv.textContent = '🤖';
    } else {
        const initials = currentEmployee.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        avatarDiv.textContent = initials;
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;

    contentDiv.appendChild(textDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show/Hide Typing Indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message assistant';
    indicator.id = 'typing-indicator';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    contentDiv.appendChild(typingDiv);
    indicator.appendChild(avatarDiv);
    indicator.appendChild(contentDiv);

    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Generate Response (Simple AI simulation)
function generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    const { onboardingData, role, project } = currentEmployee;

    // Keyword-based responses
    if (lowerMessage.includes('manager') || lowerMessage.includes('report')) {
        return `Your manager is ${onboardingData.role.manager}, who leads the ${onboardingData.role.team}. You can reach them at ${onboardingData.role.managerEmail}. They'll be your main point of contact for questions about your role and day-to-day work.`;
    }

    if (lowerMessage.includes('slack') || lowerMessage.includes('channel')) {
        const channels = onboardingData.slack.channels.join(', ');
        return `You've been added to these Slack channels: ${channels}. These are the key channels for your role and project. You can join additional channels anytime based on your interests!`;
    }

    if (lowerMessage.includes('github') || lowerMessage.includes('repo')) {
        const repos = onboardingData.github.repos.map(r => `${r.name} (${r.url})`).join('\n');
        return `You have access to these GitHub repositories:\n\n${repos}\n\nYou can find setup instructions and contributing guidelines in each repo's README file.`;
    }

    if (lowerMessage.includes('aurora') || lowerMessage.includes('design system')) {
        return `The Aurora Design System is Raspberry Coffee's next-generation component framework. It's built with React, TypeScript, and Storybook. The repo is at https://github.com/JieHan-eng/aurora-design-system. Your main tasks will include implementing component variants, maintaining design tokens, and running accessibility tests.`;
    }

    if (lowerMessage.includes('first day') || lowerMessage.includes('start')) {
        return `Great question! On your first day, focus on:\n\n1. Setting up your development environment\n2. Introducing yourself in Slack channels\n3. Meeting with your manager and team\n4. Reviewing the project documentation\n5. Taking a small "good first issue" to get familiar with the workflow\n\nDon't worry about being productive right away - it's all about learning and getting comfortable!`;
    }

    if (lowerMessage.includes('who') && lowerMessage.includes('contact')) {
        return `For different questions, here's who to contact:\n\n• Technical issues: Your team lead or manager\n• IT/equipment: Peter Adams (IT Manager)\n• HR/benefits: Fatima Khan (People Ops)\n• General questions: Your onboarding buddy or #onboarding channel\n\nDon't hesitate to ask - everyone's here to help!`;
    }

    if (lowerMessage.includes('task') || lowerMessage.includes('first week')) {
        return `Your first week tasks include:\n\n• Complete IT security training\n• Set up your dev environment\n• Review existing components in Storybook\n• Attend the weekly design system sync\n• Pick up a starter issue from Jira\n• Have coffee chats with team members\n\nTake it one step at a time, and don't hesitate to ask for help!`;
    }

    if (lowerMessage.includes('value') || lowerMessage.includes('culture')) {
        return `Raspberry Coffee's core values are:\n\n1. Simplicity is the Ultimate Sophistication\n2. Privacy is a Human Right\n3. Deeply Integrated, Not Merely Connected\n4. Craft in Every Detail\n\nThese values guide everything we do, from product design to how we work together as a team.`;
    }

    // Default response
    return `That's a great question! I can help you with information about:\n\n• Your manager and team\n• Slack channels and GitHub repos\n• The Aurora Design System project\n• First week tasks and onboarding process\n• Company values and culture\n• Who to contact for different needs\n\nWhat specific aspect would you like to know more about?`;
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('loggedInEmployee');
        location.reload();
    }
}



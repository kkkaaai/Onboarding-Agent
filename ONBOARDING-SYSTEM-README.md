# Raspberry Coffee - Complete Onboarding System

A professional demo onboarding system with HR portal and AI-powered employee assistant.

## 🎯 What This System Does

1. **HR Portal** (`hr-onboarding.html`) - HR onboards new employees
2. **Employee Portal** (`employee-portal.html`) - Employees login and access AI assistant
3. **AI Chatbot** (`index.html`) - Anam AI avatar for onboarding help

## 📁 Project Structure

```
Chatbot_testing/
├── hr-onboarding.html          # HR onboarding form
├── employee-portal.html        # Employee login + chat
├── index.html                  # Anam AI chatbot (embedded in employee portal)
├── config.js                   # Anam API configuration
├── upload-knowledge-base.js    # Script to upload docs to Anam
├── package.json
├── styles/
│   ├── hr-portal.css          # HR portal styling
│   ├── employee-portal.css    # Employee portal styling
│   └── chatbot.css           # Chatbot styling
├── js/
│   ├── data.js               # Hardcoded project/role configs
│   ├── hr-onboarding.js      # HR form logic
│   └── employee-portal.js    # Employee portal logic
└── knowledge-base/
    ├── company-info.txt           # Full company directory
    ├── kai-yang-profile.txt       # Kai Yang's profile
    ├── github-aurora-project.txt  # Aurora repo guide
    ├── slack-channels-info.txt    # Slack channels info
    └── onboarding-tasks.txt       # First 30 days checklist
```

## 🚀 Quick Start

### Step 1: Upload Knowledge Base to Anam

Your knowledge base files are ready. Upload them to Anam:

**Option A: Via Anam Lab UI** (Recommended)
1. Go to [https://lab.anam.ai/knowledge](https://lab.anam.ai/knowledge)
2. Find your folder: "Raspberry Coffee Onboarding" (ID: `befa776a-c557-4846-b33b-620811e11327`)
3. Upload all 5 files from `knowledge-base/` folder
4. Wait ~30 seconds for processing

**Option B: Via Script** (if it works)
```bash
node upload-knowledge-base.js
```

### Step 2: Start Local Server

```bash
npm start
# or
npx http-server -p 8000
```

### Step 3: Test the Complete Flow

#### A. HR Onboarding Process

1. Open `http://localhost:8000/hr-onboarding.html`
2. Fill in the form:
   - **Name**: Kai Yang
   - **Email**: kai.yang@raspberry-coffee.com
   - **Password**: (create any password, e.g., "raspberry123")
   - **Project**: Aurora Design System
   - **Role**: Design System Intern
3. Click "Begin Onboarding Process"
4. Watch the fake progress animation (4 steps)
5. See success screen with Slack channels, GitHub repos, and manager info
6. Click "Go to Employee Portal"

#### B. Employee Portal Login

1. You'll be at `http://localhost:8000/employee-portal.html`
2. Login with:
   - **Name**: Kai Yang
   - **Password**: (whatever you set in HR portal)
3. After login, you'll see the chat interface

#### C. Chat Interface (Two Modes)

**Avatar Mode** (default):
- Shows Anam AI video avatar
- Can speak with voice
- Full conversational AI with face

**Text Mode**:
- ChatGPT-style text interface
- Type questions, get instant responses
- Simulated AI responses based on knowledge

Try asking:
- "Who is my manager?"
- "What Slack channels am I in?"
- "Tell me about the Aurora Design System"
- "What should I do on my first day?"
- "How do I contact IT support?"

## 🎨 Design Philosophy

- **Clean & Professional**: Corporate HR aesthetic, not "AI-generated"
- **Responsive**: Works on desktop and mobile
- **Smooth Animations**: Professional transitions and loading states
- **Accessible**: Proper focus states, keyboard navigation

## 📊 Hardcoded Data

All data is hardcoded in `js/data.js`:

**Projects:**
- Aurora Design System
- Project Nova  
- Customer 360

**Roles:**
- Design System Intern
- Frontend Engineer
- UX Designer
- Software Engineer
- Product Manager
- QA Engineer
- Data Engineer
- Analytics Engineer
- ML Engineer

Each project has specific:
- GitHub repositories
- Slack channels
- Available roles

## 🔧 How It Works

### Data Flow

```
HR Onboarding
    ↓ (stores in localStorage)
Employee Login
    ↓ (validates against localStorage)
Chat Interface
    ↓ (uses Anam AI + simulated responses)
```

### localStorage Keys

- `currentEmployee` - Most recently onboarded employee
- `employee_{email}` - Individual employee records
- `loggedInEmployee` - Currently logged in employee

### Mode Toggle

- **Avatar Mode**: Embeds `index.html` (Anam AI) in iframe
- **Text Mode**: Custom chat UI with keyword-based responses

## 🎭 Testing Different Scenarios

### Test Multiple Employees

Onboard different people with different projects/roles:

1. **Software Engineer on Project Nova**
   - Name: John Smith
   - Email: john.smith@raspberry-coffee.com
   - Project: Project Nova
   - Role: Software Engineer

2. **Data Engineer on Customer 360**
   - Name: Maria Garcia
   - Email: maria.garcia@raspberry-coffee.com
   - Project: Customer 360
   - Role: Data Engineer

Each will get different Slack channels and GitHub repos!

## 🐛 Troubleshooting

### "Invalid credentials" on employee portal
- Make sure you used the exact same name and password from HR onboarding
- Names are case-insensitive but passwords are case-sensitive
- Clear localStorage and re-onboard if needed: `localStorage.clear()`

### Anam chatbot not loading in Avatar Mode
- Check that `config.js` has your API key
- Make sure folder ID is correct
- Verify knowledge base files are uploaded and in "READY" status
- Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### HR form dropdowns not working
- Check browser console for errors
- Ensure `js/data.js` is loading correctly
- Try clearing browser cache

## 📝 Customization

### Add More Projects

Edit `js/data.js` and add to `PROJECTS` object:

```javascript
myproject: {
    id: 'myproject',
    name: 'My New Project',
    description: 'Project description',
    githubRepos: [{name: 'repo-name', url: 'https://...'}],
    slackChannels: ['#channel1', '#channel2'],
    availableRoles: ['Role 1', 'Role 2']
}
```

### Change Styles

- HR Portal: Edit `styles/hr-portal.css`
- Employee Portal: Edit `styles/employee-portal.css`
- Chatbot: Edit `styles/chatbot.css`

### Modify Chat Responses

Edit `generateResponse()` function in `js/employee-portal.js`

## 🎉 Success Criteria

✅ HR can onboard Kai Yang
✅ Progress animation looks professional
✅ Employee can login
✅ Toggle between avatar and text modes works
✅ Chatbot knows about Slack channels and GitHub repos
✅ UI is clean and professional

## 📚 Knowledge Base Files

Your chatbot has access to:

1. **company-info.txt** - Full company directory, all 38 employees
2. **kai-yang-profile.txt** - Kai's role, Aurora project details
3. **github-aurora-project.txt** - Repository setup, contributing guide
4. **slack-channels-info.txt** - All company Slack channels explained
5. **onboarding-tasks.txt** - Complete 30-day onboarding checklist

## 🔒 Security Notes

- This is a DEMO system with hardcoded data
- Passwords stored in plain text in localStorage (NOT production-ready)
- No real backend or database
- For production, implement proper authentication and encryption

## 🚀 Next Steps

To make this production-ready:
1. Add real backend API
2. Implement proper authentication (JWT tokens)
3. Use database instead of localStorage
4. Hash passwords with bcrypt
5. Add real Slack/GitHub API integrations
6. Implement proper error handling
7. Add analytics and logging

---

Built with ❤️ for Raspberry Coffee onboarding experience



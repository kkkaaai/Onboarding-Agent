# Raspberry Coffee - Employee Onboarding Chatbot

An AI-powered chatbot avatar built with [Anam AI](https://anam.ai) to help onboard new employees at Raspberry Coffee by answering questions about the team, company culture, projects, and who to contact.

![Anam AI Chatbot](https://img.shields.io/badge/Powered%20by-Anam%20AI-blue)

## Features

✨ **Interactive AI Avatar** - Real-time video conversation with an AI persona
🧠 **Knowledge Base Integration** - Answers questions based on your company documents
🎯 **Onboarding Focused** - Customized for new employee needs
💬 **Natural Conversations** - Voice-based interaction with speech-to-text
📚 **Semantic Search** - Retrieves relevant information from your knowledge base using RAG

## Prerequisites

- Node.js 18+ (for uploading documents)
- Anam AI API key ([get one here](https://lab.anam.ai))
- A local web server (Python, Node.js, or PHP)
- Modern web browser with microphone access

## Quick Start

### 1. Add Your API Key

Open `config.js` and replace `YOUR_API_KEY_HERE` with your actual Anam API key:

```javascript
export const CONFIG = {
    API_KEY: "your-actual-api-key-here",
    // ... rest of config
};
```

### 2. Prepare Your Knowledge Base

The `knowledge-base/` folder contains Raspberry Coffee's company information:

- `company-overview.txt` - Company mission, values, products, and executive team
- `team-directory.txt` - Complete team directory with roles and contact info
- `onboarding-faq.txt` - Common onboarding questions and answers

**Supported formats:** TXT, MD, PDF, DOCX, CSV, JSON (up to 50MB per file)

**To add more documents:**
- Add files to the `knowledge-base/` folder (TXT, MD, PDF, DOCX, CSV, JSON)
- Use clear headings and sections
- Make paragraphs self-contained
- Use descriptive file names
- Keep documents focused on specific topics

### 3. Upload Documents to Anam

Run the upload script to create your knowledge base:

```bash
node upload-knowledge-base.js
```

This script will:
1. Create a knowledge folder in Anam
2. Upload all documents from the `knowledge-base/` folder
3. Wait for processing (~30 seconds)
4. Display your folder ID

**Save the folder ID** - you'll need it in the next step!

### 4. Update Configuration with Folder ID

Copy the folder ID from the upload script output and update `config.js`:

```javascript
// Replace with your actual folder ID
KNOWLEDGE_FOLDER_ID: "550e8400-e29b-41d4-a716-446655440000",

// Also update in the tools section
tools: [
    {
        // ...
        documentFolderIds: ["550e8400-e29b-41d4-a716-446655440000"]
    }
]
```

### 5. Start Local Server

Choose one of these methods to start a local web server:

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

### 6. Open and Test

1. Navigate to `http://localhost:8000` in your browser
2. Allow microphone access when prompted
3. The AI assistant will appear and start listening
4. Start speaking to ask onboarding questions!

## How It Works

### Knowledge Base (RAG)

The chatbot uses Anam's built-in Retrieval-Augmented Generation (RAG) system:

1. **Upload**: Your documents are uploaded to Anam's cloud
2. **Processing**: Documents are chunked and indexed with vector embeddings (~30 seconds)
3. **Search**: When users ask questions, the AI searches your documents semantically
4. **Response**: The AI generates answers based on retrieved information

### Knowledge Tools

The chatbot uses a "knowledge tool" that enables the AI to automatically search your documents:

```javascript
{
    type: "server",
    subtype: "knowledge",
    name: "search_company_docs",
    description: "Search company documentation for onboarding information...",
    documentFolderIds: ["your-folder-id"]
}
```

The AI **automatically decides** when to invoke this tool based on the conversation context.

## Customization

### Change the Avatar

Browse the [Avatar Gallery](https://docs.anam.ai/resources/avatar-gallery) and update `config.js`:

```javascript
avatarId: "your-preferred-avatar-id"
```

### Change the Voice

Browse the [Voice Gallery](https://docs.anam.ai/resources/voice-gallery) and update `config.js`:

```javascript
voiceId: "your-preferred-voice-id"
```

### Customize System Prompt

Edit the `systemPrompt` in `config.js` to change the AI's personality and behavior:

```javascript
systemPrompt: `You are a helpful onboarding assistant...
- Your key responsibilities
- Your communication style
- How to handle specific situations
`
```

### Adjust Session Duration

Control how long sessions last (default: 30 minutes):

```javascript
maxSessionLengthSeconds: 1800  // 30 minutes
```

## Project Structure

```
chatbot_testing/
├── index.html                    # Main chatbot interface
├── styles.css                    # Professional UI styling
├── config.js                     # API key and persona configuration
├── upload-knowledge-base.js      # Script to upload documents
├── knowledge-base/               # Company documents
│   ├── company-overview.txt
│   ├── benefits-policies.txt
│   ├── it-setup-guide.txt
│   └── onboarding-faq.txt
└── README.md                     # This file
```

## Updating Knowledge Base

To update your knowledge base with new or modified documents:

1. Add/update files in the `knowledge-base/` folder
2. Run the upload script again: `node upload-knowledge-base.js`
3. Update the folder ID in `config.js` (if you created a new folder)

**Note:** Each upload creates a new folder. To update existing documents, you'll need to use the Anam API to delete and re-upload, or use the [Anam Lab UI](https://lab.anam.ai/knowledge).

## Troubleshooting

### "Failed to connect. Check your API key"

- Verify your API key is correct in `config.js`
- Ensure you're not using the placeholder `YOUR_API_KEY_HERE`
- Check that your API key is active at [Anam Lab](https://lab.anam.ai)

### No search results / AI doesn't find information

- Wait 30-60 seconds after upload for processing to complete
- Check document status in [Anam Lab](https://lab.anam.ai/knowledge)
- Try rephrasing your question more specifically
- Verify folder ID is correct in `config.js`

### Microphone not working

- Check browser permissions (click lock icon in address bar)
- Ensure microphone is not being used by another application
- Try refreshing the page
- Test microphone in browser settings

### Upload script fails

- Check file sizes (max 50MB per file)
- Verify API key is set correctly
- Ensure files are in supported formats
- Check internet connection

### AI doesn't use knowledge base

- Verify `documentFolderIds` array contains your folder ID
- Check that documents are in `READY` status
- Make sure the knowledge tool is in the `tools` array
- Try asking more specific questions related to your documents

## Environment Variables (Optional)

You can set your API key as an environment variable instead of editing `config.js`:

```bash
export ANAM_API_KEY="your-api-key"
node upload-knowledge-base.js
```

## Security Best Practices

⚠️ **Important Security Notes:**

- Never commit your API key to version control
- Add `config.js` to `.gitignore` if using git
- Use HTTPS in production environments
- Implement proper authentication for production deployments
- Consider using environment variables for API keys

## Resources

- [Anam Documentation](https://docs.anam.ai)
- [Knowledge Base Guide](https://docs.anam.ai/concepts/knowledge-base)
- [Personas Guide](https://docs.anam.ai/concepts/personas)
- [Avatar Gallery](https://docs.anam.ai/resources/avatar-gallery)
- [Voice Gallery](https://docs.anam.ai/resources/voice-gallery)
- [Anam Lab](https://lab.anam.ai) - Test and configure personas

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review [Anam's documentation](https://docs.anam.ai)
3. Contact Anam support (if you have issues with their API)
4. Check browser console for error messages

## Next Steps

Now that you have a working chatbot:

- 🎨 Customize the UI in `styles.css`
- 🧠 Refine the system prompt for better responses
- 📚 Add more company documents to expand knowledge
- 🔧 Implement additional [tools](https://docs.anam.ai/concepts/tools) for actions
- 🚀 Deploy to production with proper authentication

## License

This project is provided as-is for use with Anam AI services.

---

Built with ❤️ using [Anam AI](https://anam.ai)


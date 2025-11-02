#!/usr/bin/env node

/**
 * Upload Knowledge Base to Anam AI
 * 
 * This script uploads your company documents to Anam's knowledge base
 * and creates a knowledge folder for your onboarding assistant.
 * 
 * Usage:
 *   1. Add your API key in config.js
 *   2. Place your company documents in the knowledge-base/ folder
 *   3. Run: node upload-knowledge-base.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use API key from config.js, or environment variable, or placeholder
const API_KEY = process.env.ANAM_API_KEY || CONFIG.API_KEY;
const API_BASE = "https://api.anam.ai/v1";
const KNOWLEDGE_BASE_DIR = path.join(__dirname, 'knowledge-base');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function createFolder(folderName) {
    log(`\n📁 Creating knowledge folder: "${folderName}"...`, 'blue');
    
    const response = await fetch(`${API_BASE}/knowledge/groups`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: folderName })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create folder: ${error}`);
    }

    const data = await response.json();
    log(`✓ Folder created with ID: ${data.id}`, 'green');
    return data.id;
}

async function uploadDocument(folderId, filePath) {
    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.pdf': 'application/pdf',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.csv': 'text/csv',
        '.json': 'application/json'
    };
    const contentType = contentTypes[ext] || 'text/plain';

    log(`\n📄 Uploading: ${filename} (${(fileSize / 1024).toFixed(2)} KB)...`, 'cyan');

    // Step 1: Get presigned upload URL
    const presignedResponse = await fetch(
        `${API_BASE}/knowledge/groups/${folderId}/documents/presigned-upload`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename,
                contentType,
                fileSize
            })
        }
    );

    if (!presignedResponse.ok) {
        const error = await presignedResponse.text();
        throw new Error(`Failed to get upload URL: ${error}`);
    }

    const { uploadUrl, documentId } = await presignedResponse.json();

    // Step 2: Upload file to presigned URL
    const fileData = fs.readFileSync(filePath);
    const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: fileData,
        headers: {
            'Content-Type': contentType
        }
    });

    if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    // Step 3: Confirm upload
    const confirmResponse = await fetch(
        `${API_BASE}/knowledge/documents/${documentId}/confirm-upload`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileSize })
        }
    );

    if (!confirmResponse.ok) {
        const error = await confirmResponse.text();
        throw new Error(`Failed to confirm upload: ${error}`);
    }

    log(`  ✓ Uploaded successfully (Document ID: ${documentId})`, 'green');
    return documentId;
}

async function checkDocumentStatus(documentId, maxAttempts = 20) {
    for (let i = 0; i < maxAttempts; i++) {
        const response = await fetch(
            `${API_BASE}/knowledge/documents/${documentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to check document status`);
        }

        const doc = await response.json();
        
        if (doc.status === 'READY') {
            return true;
        } else if (doc.status === 'FAILED') {
            throw new Error(`Document processing failed: ${doc.errorMessage || 'Unknown error'}`);
        }

        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return false;
}

async function main() {
    log('\n🚀 Anam Knowledge Base Upload Tool', 'blue');
    log('=====================================\n', 'blue');

    // Validate API key
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        log('❌ Error: Please set your API key in config.js or as ANAM_API_KEY environment variable', 'red');
        process.exit(1);
    }

    // Check if knowledge-base directory exists
    if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
        log(`❌ Error: Directory not found: ${KNOWLEDGE_BASE_DIR}`, 'red');
        log('Please create the knowledge-base/ directory and add your documents.', 'yellow');
        process.exit(1);
    }

    // Get all files in knowledge-base directory
    const files = fs.readdirSync(KNOWLEDGE_BASE_DIR)
        .filter(file => !file.startsWith('.'))
        .map(file => path.join(KNOWLEDGE_BASE_DIR, file))
        .filter(file => fs.statSync(file).isFile());

    if (files.length === 0) {
        log('❌ Error: No files found in knowledge-base/ directory', 'red');
        process.exit(1);
    }

    log(`Found ${files.length} document(s) to upload\n`, 'cyan');

    try {
        // Create knowledge folder
        const folderId = await createFolder('Raspberry Coffee Onboarding');

        // Upload all documents
        const documentIds = [];
        for (const filePath of files) {
            const documentId = await uploadDocument(folderId, filePath);
            documentIds.push(documentId);
        }

        // Wait for processing
        log('\n⏳ Waiting for documents to be processed (~30 seconds)...', 'yellow');
        
        let allReady = true;
        for (const documentId of documentIds) {
            const ready = await checkDocumentStatus(documentId);
            if (!ready) {
                log(`⚠️  Document ${documentId} is still processing. It may take a bit longer.`, 'yellow');
                allReady = false;
            }
        }

        // Success!
        log('\n✅ Upload complete!', 'green');
        log('\n📋 Next steps:', 'blue');
        log('1. Copy this folder ID:', 'cyan');
        log(`   ${folderId}`, 'green');
        log('\n2. Update config.js:', 'cyan');
        log('   - Replace KNOWLEDGE_FOLDER_ID with the folder ID above', 'yellow');
        log('   - Replace YOUR_FOLDER_ID_HERE in the tools section', 'yellow');
        log('\n3. Start your local server and test the chatbot!', 'cyan');
        
        if (!allReady) {
            log('\n⚠️  Note: Some documents may still be processing. Wait a minute and try again if search doesn\'t work immediately.', 'yellow');
        }

    } catch (error) {
        log(`\n❌ Error: ${error.message}`, 'red');
        process.exit(1);
    }
}

main();


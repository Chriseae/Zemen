import { LibraryItem } from '../types';
import { processDocument, findRelevantChunks, ProcessedDocument } from './documentProcessor';
import { getLibraryItems, saveLibraryItem, updateLibraryItem } from './firestoreService';

// Extended LibraryItem with processed content
export interface ProcessedLibraryItem extends LibraryItem {
    processedContent?: ProcessedDocument;
}

// Process and store a document
export const processAndStoreDocument = async (
    userId: string,
    file: File,
    itemId: string
): Promise<ProcessedDocument> => {
    try {
        // Process the document
        const processed = await processDocument(file);

        // Update the library item with processed content
        await updateLibraryItem(userId, itemId, {
            processedContent: processed
        } as any);

        return processed;
    } catch (error) {
        console.error('Error processing document:', error);
        throw error;
    }
};

// Get relevant context from user's library for a query
export const getRelevantContext = async (
    userId: string,
    query: string,
    maxChunks: number = 3
): Promise<string> => {
    try {
        // Get all library items for the user
        const result = await getLibraryItems(userId);

        if (!result.success || !result.data || result.data.length === 0) {
            return ''; // No library items
        }

        const items = result.data as ProcessedLibraryItem[];

        // Filter items that have processed content
        const processedItems = items.filter(item => item.processedContent?.chunks);

        if (processedItems.length === 0) {
            return ''; // No processed documents
        }

        // Find relevant chunks
        const documents = processedItems.map(item => ({
            chunks: item.processedContent!.chunks,
            title: item.title
        }));

        const relevantChunks = findRelevantChunks(query, documents, maxChunks);

        if (relevantChunks.length === 0) {
            return ''; // No relevant content found
        }

        // Format context for the AI
        const context = relevantChunks
            .map(chunk => `[From: ${chunk.title}]\n${chunk.text}`)
            .join('\n\n---\n\n');

        return context;
    } catch (error) {
        console.error('Error getting relevant context:', error);
        return '';
    }
};

// Build enhanced system prompt with RAG context
export const buildRAGPrompt = (
    baseSystemPrompt: string,
    context: string,
    userQuery: string
): string => {
    if (!context) {
        return baseSystemPrompt; // No context available
    }

    return `${baseSystemPrompt}

**IMPORTANT: User's Personal Knowledge Base**

The user has uploaded the following documents to their knowledge library. Use this information to provide more accurate and personalized responses:

${context}

**Instructions:**
- Prioritize information from the user's uploaded documents when answering their questions
- If the answer is in the uploaded documents, cite the source (e.g., "According to your document 'filename'...")
- If the uploaded documents don't contain relevant information, use your general knowledge
- Be clear about whether you're using their documents or general knowledge

**User Query:** ${userQuery}`;
};

// Check if a query might benefit from RAG
export const shouldUseRAG = (query: string): boolean => {
    // Keywords that suggest the user wants information from their documents
    const ragKeywords = [
        'document', 'file', 'uploaded', 'my notes', 'according to',
        'in my', 'from my', 'what did I', 'remind me',
        // Amharic equivalents
        'ሰነድ', 'ፋይል', 'ማስታወሻ', 'መረጃ'
    ];

    const lowerQuery = query.toLowerCase();
    return ragKeywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()));
};

// Get RAG-enhanced response
export const getRAGEnhancedPrompt = async (
    userId: string | null,
    query: string,
    baseSystemPrompt: string
): Promise<string> => {
    // If no user or query doesn't suggest using RAG, return base prompt
    if (!userId || !shouldUseRAG(query)) {
        return baseSystemPrompt;
    }

    // Get relevant context from library
    const context = await getRelevantContext(userId, query);

    // Build enhanced prompt
    return buildRAGPrompt(baseSystemPrompt, context, query);
};
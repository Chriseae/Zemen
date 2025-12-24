// Document text extraction service
// Extracts text from various file types for RAG processing

export interface ProcessedDocument {
    text: string;
    chunks: string[];
    metadata: {
        filename: string;
        fileType: string;
        pageCount?: number;
        wordCount: number;
    };
}

// Split text into chunks for better retrieval
const chunkText = (text: string, chunkSize: number = 1000, overlap: number = 200): string[] => {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        const endIndex = Math.min(startIndex + chunkSize, text.length);
        const chunk = text.slice(startIndex, endIndex);
        chunks.push(chunk.trim());

        // Move forward with overlap
        startIndex += chunkSize - overlap;
    }

    return chunks.filter(chunk => chunk.length > 50); // Filter out tiny chunks
};

// Process PDF files
const processPDF = async (file: File): Promise<ProcessedDocument> => {
    try {
        // For web environment, we'll use a different approach
        // PDF.js would be better for browser, but for now we'll use a simple extraction
        const text = await file.text();

        // Basic text extraction (in production, use pdf-parse or PDF.js)
        const cleanText = text
            .replace(/\0/g, '') // Remove null bytes
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();

        const chunks = chunkText(cleanText);
        const wordCount = cleanText.split(/\s+/).length;

        return {
            text: cleanText,
            chunks,
            metadata: {
                filename: file.name,
                fileType: 'pdf',
                wordCount
            }
        };
    } catch (error) {
        console.error('PDF processing error:', error);
        throw new Error('Failed to process PDF file');
    }
};

// Process text files
const processTextFile = async (file: File): Promise<ProcessedDocument> => {
    try {
        const text = await file.text();
        const chunks = chunkText(text);
        const wordCount = text.split(/\s+/).length;

        return {
            text,
            chunks,
            metadata: {
                filename: file.name,
                fileType: 'text',
                wordCount
            }
        };
    } catch (error) {
        console.error('Text file processing error:', error);
        throw new Error('Failed to process text file');
    }
};

// Process DOCX files
const processDOCX = async (file: File): Promise<ProcessedDocument> => {
    try {
        // For browser environment, we'll read as text
        // In production, use mammoth.js for proper DOCX parsing
        const arrayBuffer = await file.arrayBuffer();
        const text = new TextDecoder().decode(arrayBuffer);

        const cleanText = text
            .replace(/[^\x20-\x7E\u1200-\u137F\n]/g, '') // Keep printable ASCII and Amharic
            .replace(/\s+/g, ' ')
            .trim();

        const chunks = chunkText(cleanText);
        const wordCount = cleanText.split(/\s+/).length;

        return {
            text: cleanText,
            chunks,
            metadata: {
                filename: file.name,
                fileType: 'docx',
                wordCount
            }
        };
    } catch (error) {
        console.error('DOCX processing error:', error);
        throw new Error('Failed to process DOCX file');
    }
};

// Main document processor
export const processDocument = async (file: File): Promise<ProcessedDocument> => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Determine file type and process accordingly
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return processPDF(file);
    } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')
    ) {
        return processDOCX(file);
    } else if (
        fileType === 'text/plain' ||
        fileName.endsWith('.txt') ||
        fileName.endsWith('.md')
    ) {
        return processTextFile(file);
    } else {
        throw new Error(`Unsupported file type: ${fileType || 'unknown'}`);
    }
};

// Calculate simple similarity (cosine similarity approximation)
export const calculateSimilarity = (query: string, text: string): number => {
    const queryWords = query.toLowerCase().split(/\s+/);
    const textWords = text.toLowerCase().split(/\s+/);

    const querySet = new Set(queryWords);
    const textSet = new Set(textWords);

    // Count matching words
    let matches = 0;
    querySet.forEach(word => {
        if (textSet.has(word)) matches++;
    });

    // Simple similarity score
    const similarity = matches / Math.sqrt(querySet.size * textSet.size);
    return similarity;
};

// Find most relevant chunks for a query
export const findRelevantChunks = (
    query: string,
    documents: Array<{ chunks: string[]; title: string }>,
    topK: number = 3
): Array<{ text: string; title: string; score: number }> => {
    const allChunks: Array<{ text: string; title: string; score: number }> = [];

    // Calculate similarity for all chunks
    documents.forEach(doc => {
        doc.chunks.forEach(chunk => {
            const score = calculateSimilarity(query, chunk);
            allChunks.push({
                text: chunk,
                title: doc.title,
                score
            });
        });
    });

    // Sort by score and return top K
    return allChunks
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .filter(chunk => chunk.score > 0.1); // Filter out very low scores
};
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  codeBlocks?: CodeBlock[];
  language?: string;
  processingStats?: ProcessingStats;
}

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  filename?: string;
  description?: string;
  metadata?: CodeMetadata;
}

export interface CodeMetadata {
  lineCount: number;
  hasImports: boolean;
  hasExports: boolean;
  hasComments: boolean;
  estimatedComplexity: "low" | "medium" | "high";
  dependencies?: string[];
}

export interface ProcessingStats {
  totalBlocks: number;
  languages: string[];
  totalLines: number;
  blocksWithFiles: number;
  blocksWithImports: number;
  blocksWithExports: number;
  complexityDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  allDependencies: string[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface CodeGenerationRequest {
  prompt: string;
  language?: string;
  framework?: string;
  requirements?: string[];
}

// ===== EXTRACTION TRACKING TYPES =====
export interface ExtractionLog {
  timestamp: Date;
  inputLength: number;
  blocksFound: number;
  languages: string[];
  processingTime: number;
  method: "enhanced" | "simple" | "fallback";
}

export interface CodeProcessingResult {
  blocks: CodeBlock[];
  stats: ProcessingStats;
  extractionLog: ExtractionLog;
  success: boolean;
  errors?: string[];
}

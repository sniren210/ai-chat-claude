export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  codeBlocks?: CodeBlock[];
  processingStats?: ProcessingStats;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface CodeBlock {
  id: string;
  language: string;
  filename?: string;
  code: string;
  metadata?: CodeBlockMetadata;
}

export interface CodeBlockMetadata {
  lineCount: number;
  hasImports: boolean;
  hasExports: boolean;
  hasComments: boolean;
  estimatedComplexity: "low" | "medium" | "high";
  dependencies?: string[];
  functions?: string[];
  classes?: string[];
  variables?: string[];
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
  extractionTime: number;
}

export interface ExtractionLog {
  timestamp: Date;
  level: "info" | "warning" | "error";
  message: string;
  details?: unknown;
}

// ===== VISUAL PREVIEW TYPES =====

export interface JSFunction {
  name: string;
  params: string[];
  type: "function" | "arrow" | "method";
  lineCount: number;
}

export interface JSVariable {
  name: string;
  type: string;
}

export interface JSImport {
  module: string;
  items: string[];
}

export interface JSClass {
  name: string;
  methods: string[];
  properties: string[];
  extends?: string;
}

export interface SQLTable {
  name: string;
  columns: Array<{ name: string; type: string }>;
}

export interface SQLQuery {
  type: string;
  tables: string[];
  preview: string;
}

export interface PythonFunction {
  name: string;
  params: string[];
  lineCount: number;
  decorators: string[];
}

export interface PythonClass {
  name: string;
  methods: string[];
  attributes: string[];
  inheritance: string[];
}

export interface PythonImport {
  module: string;
  alias?: string;
  items: string[];
}

export interface CodeGenerationRequest {
  prompt: string;
  language?: string;
  framework?: string;
  requirements?: string[];
}

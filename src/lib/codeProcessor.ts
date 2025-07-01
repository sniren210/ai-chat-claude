// ===== CODE PROCESSING UTILITIES =====

export interface ProcessedCodeBlock {
  id: string;
  language: string;
  filename?: string;
  code: string;
  metadata?: {
    lineCount: number;
    hasImports: boolean;
    hasExports: boolean;
    hasComments: boolean;
    estimatedComplexity: "low" | "medium" | "high";
    dependencies?: string[];
  };
}

export interface RawCodeBlock {
    language: string
    filename?: string
    code: string
    rawMatch: string
}

// ===== MAIN PROCESSING FUNCTION =====
export function processCodeBlocks(rawText: string): ProcessedCodeBlock[] {
  console.log("🏭 CODE PROCESSOR: Starting processing");
  console.log("📄 Input text length:", rawText.length);

  // ===== EXTRACTION PHASE =====
  const extractedBlocks = extractRawCodeBlocks(rawText);

  // ===== ENHANCEMENT PHASE =====
  const processedBlocks = enhanceCodeBlocks(extractedBlocks);

  // ===== VALIDATION PHASE =====
  const validatedBlocks = validateCodeBlocks(processedBlocks);

  console.log("✅ CODE PROCESSOR: Processing complete");
  console.log(
    `📦 Final result: ${validatedBlocks.length} validated code blocks`
  );

  return validatedBlocks;
}

// ===== EXTRACTION PHASE FUNCTION =====
function extractRawCodeBlocks(text: string) {
  console.log("🔍 EXTRACTION PHASE: Finding code blocks");

  const codeBlockRegex = /```(\w+):?([^\n]*)\n([\s\S]*?)```/g;
  const rawBlocks = [];
  let match;
  let extractionCount = 0;

  // ===== EXTRACTION LOOP =====
  while ((match = codeBlockRegex.exec(text)) !== null) {
    extractionCount++;
    console.log(`📦 EXTRACTING block ${extractionCount}:`);

    const rawBlock = {
      language: match[1],
      filename: match[2].trim() || undefined,
      code: match[3].trim(),
      rawMatch: match[0],
    };

    console.log(`   Language: ${rawBlock.language}`);
    console.log(`   Filename: ${rawBlock.filename || "none"}`);
    console.log(`   Code length: ${rawBlock.code.length}`);

    rawBlocks.push(rawBlock);
  }

  console.log(`✅ EXTRACTION PHASE: Found ${rawBlocks.length} raw blocks`);
  return rawBlocks;
}

// ===== ENHANCEMENT PHASE FUNCTION =====
function enhanceCodeBlocks(rawBlocks: RawCodeBlock[]): ProcessedCodeBlock[] {
  console.log("⚡ ENHANCEMENT PHASE: Adding metadata and processing");

  return rawBlocks.map((rawBlock, index) => {
    console.log(`🔧 ENHANCING block ${index + 1}:`);

    // ===== METADATA GENERATION =====
    const metadata = generateCodeMetadata(rawBlock.code, rawBlock.language);

    const enhancedBlock: ProcessedCodeBlock = {
      id: `code_${Date.now()}_${index}_${Math.random()
        .toString(36)
        .substr(2, 6)}`,
      language: rawBlock.language,
      filename: rawBlock.filename,
      code: rawBlock.code,
      metadata: {
        ...metadata,
        estimatedComplexity: metadata.estimatedComplexity as
          | "low"
          | "medium"
          | "high",
      },
    };

    console.log(`   Generated ID: ${enhancedBlock.id}`);
    console.log(`   Metadata:`, metadata);

    return enhancedBlock;
  });
}

// ===== METADATA GENERATION FUNCTION =====
function generateCodeMetadata(code: string, language: string) {
  console.log("📊 GENERATING METADATA for", language);

  const lines = code.split("\n");
  const lineCount = lines.length;

  // ===== PATTERN DETECTION =====
  const patterns = {
    hasImports: detectImports(code, language),
    hasExports: detectExports(code, language),
    hasComments: detectComments(code, language),
    dependencies: extractDependencies(code, language),
  };

  const estimatedComplexity =
    lineCount > 100 ? "high" : lineCount > 30 ? "medium" : "low";

  console.log("📈 Metadata generated:", {
    lineCount,
    ...patterns,
    estimatedComplexity,
  });

  return {
    lineCount,
    ...patterns,
    estimatedComplexity,
  };
}

// ===== PATTERN DETECTION FUNCTIONS =====
function detectImports(code: string, language: string): boolean {
  const importPatterns = {
    javascript: /^(import|const.*=.*require)/m,
    typescript: /^(import|const.*=.*require)/m,
    python: /^(import|from.*import)/m,
    java: /^(import|package)/m,
    csharp: /^(using|namespace)/m,
    go: /^(import|package)/m,
    rust: /^(use|extern)/m,
    php: /^(use|require|include)/m,
  };

  const pattern =
    importPatterns[language.toLowerCase() as keyof typeof importPatterns];
  return pattern
    ? pattern.test(code)
    : /^(import|#include|using|require)/m.test(code);
}

function detectExports(code: string, language: string): boolean {
  const exportPatterns = {
    javascript: /(export|module\.exports)/m,
    typescript: /(export|module\.exports)/m,
    python: /(__all__|def.*:|class.*:)/m,
    java: /(public class|public interface)/m,
    csharp: /(public class|public interface|namespace)/m,
    go: /(func|type.*struct)/m,
    rust: /(pub fn|pub struct|pub enum)/m,
    php: /(class|function|namespace)/m,
  };

  const pattern =
    exportPatterns[language.toLowerCase() as keyof typeof exportPatterns];
  return pattern
    ? pattern.test(code)
    : /(export|public|def|function)/m.test(code);
}

function detectComments(code: string, language: string): boolean {
  const commentPatterns = {
    javascript: /(\/\/|\/\*)/m,
    typescript: /(\/\/|\/\*)/m,
    python: /(#|""")/m,
    java: /(\/\/|\/\*)/m,
    csharp: /(\/\/|\/\*)/m,
    go: /(\/\/|\/\*)/m,
    rust: /(\/\/|\/\*)/m,
    php: /(\/\/|\/\*|#)/m,
    html: /(<!--)/m,
    css: /(\/\*)/m,
    sql: /(--|\/\*)/m,
  };

  const pattern =
    commentPatterns[language.toLowerCase() as keyof typeof commentPatterns];
  return pattern ? pattern.test(code) : /(\/\/|\/\*|#|<!--)/m.test(code);
}

function extractDependencies(code: string, language: string): string[] {
  console.log("🔍 EXTRACTING DEPENDENCIES for", language);

  const dependencies: string[] = [];

  // ===== DEPENDENCY EXTRACTION BY LANGUAGE =====
  switch (language.toLowerCase()) {
    case "javascript":
    case "typescript":
      // Extract from import statements
      const jsImports = code.match(/import.*from\s+['"`]([^'"`]+)['"`]/g);
      const jsRequires = code.match(/require\(['"`]([^'"`]+)['"`]\)/g);

      if (jsImports) {
        jsImports.forEach((imp) => {
          const match = imp.match(/from\s+['"`]([^'"`]+)['"`]/);
          if (match) dependencies.push(match[1]);
        });
      }

      if (jsRequires) {
        jsRequires.forEach((req) => {
          const match = req.match(/require\(['"`]([^'"`]+)['"`]\)/);
          if (match) dependencies.push(match[1]);
        });
      }
      break;

    case "python":
      // Extract from import statements
      const pyImports = code.match(/^(import\s+\w+|from\s+\w+)/gm);
      if (pyImports) {
        pyImports.forEach((imp) => {
          const match = imp.match(/(?:import|from)\s+(\w+)/);
          if (match) dependencies.push(match[1]);
        });
      }
      break;

    case "java":
      // Extract from import statements
      const javaImports = code.match(/import\s+([^;]+);/g);
      if (javaImports) {
        javaImports.forEach((imp) => {
          const match = imp.match(/import\s+([^;]+);/);
          if (match) dependencies.push(match[1]);
        });
      }
      break;

    case "go":
      // Extract from import statements
      const goImports = code.match(
        /import\s+(?:\([\s\S]*?\)|"[^"]+"|`[^`]+`)/g
      );
      if (goImports) {
        goImports.forEach((imp) => {
          const matches = imp.match(/"([^"]+)"/g);
          if (matches) {
            matches.forEach((match) => {
              dependencies.push(match.replace(/"/g, ""));
            });
          }
        });
      }
      break;
  }

  console.log(`📦 Found ${dependencies.length} dependencies:`, dependencies);
  return dependencies;
}

// ===== VALIDATION PHASE FUNCTION =====
function validateCodeBlocks(
  blocks: ProcessedCodeBlock[]
): ProcessedCodeBlock[] {
  console.log("✅ VALIDATION PHASE: Checking code blocks");

  const validatedBlocks = blocks.filter((block, index) => {
    console.log(`🔍 VALIDATING block ${index + 1}:`);

    // ===== VALIDATION CHECKS =====
    const isValid = validateCodeBlock(block);

    if (isValid) {
      console.log(`   ✅ Block ${index + 1} is valid`);
    } else {
      console.log(`   ❌ Block ${index + 1} failed validation`);
    }

    return isValid;
  });

  console.log(
    `✅ VALIDATION COMPLETE: ${validatedBlocks.length}/${blocks.length} blocks passed`
  );
  return validatedBlocks;
}

// ===== INDIVIDUAL BLOCK VALIDATION =====
function validateCodeBlock(block: ProcessedCodeBlock): boolean {
  console.log(`🔍 Validating block ID: ${block.id}`);

  // Check if code is not empty
  if (!block.code || block.code.trim().length === 0) {
    console.log("   ❌ Empty code block");
    return false;
  }

  // Check if language is specified
  if (!block.language || block.language.trim().length === 0) {
    console.log("   ❌ No language specified");
    return false;
  }

  // Check for minimum code length (avoid single character blocks)
  if (block.code.trim().length < 3) {
    console.log("   ❌ Code too short");
    return false;
  }

  // Language-specific validation
  const languageValid = validateLanguageSpecific(block.code, block.language);
  if (!languageValid) {
    console.log("   ❌ Language-specific validation failed");
    return false;
  }

  console.log("   ✅ Block validation passed");
  return true;
}

// ===== LANGUAGE-SPECIFIC VALIDATION =====
function validateLanguageSpecific(code: string, language: string): boolean {
  console.log(`🔍 Language-specific validation for: ${language}`);

  switch (language.toLowerCase()) {
    case "javascript":
    case "typescript":
      // Check for basic JS/TS syntax
      return (
        !code.includes("undefined syntax") &&
        (code.includes("function") ||
          code.includes("=>") ||
          code.includes("const") ||
          code.includes("let") ||
          code.includes("var") ||
          code.includes("class") ||
          code.includes("import") ||
          code.includes("export"))
      );

    case "python":
      // Check for basic Python syntax
      return (
        !code.includes("SyntaxError") &&
        (code.includes("def ") ||
          code.includes("class ") ||
          code.includes("import ") ||
          code.includes("from ") ||
          code.includes("if ") ||
          code.includes("for ") ||
          code.includes("=") ||
          code.includes("print"))
      );

    case "java":
      // Check for basic Java syntax
      return (
        code.includes("class ") ||
        code.includes("interface ") ||
        code.includes("public ") ||
        code.includes("private ") ||
        code.includes("import ")
      );

    case "html":
      // Check for basic HTML structure
      return code.includes("<") && code.includes(">");

    case "css":
      // Check for basic CSS syntax
      return (
        code.includes("{") &&
        code.includes("}") &&
        (code.includes(":") || code.includes("@"))
      );

    case "json":
      // Try to parse JSON
      try {
        JSON.parse(code);
        return true;
      } catch {
        return code.includes("{") || code.includes("[");
      }

    default:
      // For unknown languages, just check it's not empty
      return code.trim().length > 0;
  }
}

// ===== EXPORT PROCESSING RESULTS =====
export function getProcessingStats(blocks: ProcessedCodeBlock[]) {
  console.log("📊 GENERATING PROCESSING STATISTICS");

  const stats = {
    totalBlocks: blocks.length,
    languages: [...new Set(blocks.map((b) => b.language))],
    totalLines: blocks.reduce(
      (sum, b) => sum + (b.metadata?.lineCount || 0),
      0
    ),
    blocksWithFiles: blocks.filter((b) => b.filename).length,
    blocksWithImports: blocks.filter((b) => b.metadata?.hasImports).length,
    blocksWithExports: blocks.filter((b) => b.metadata?.hasExports).length,
    complexityDistribution: {
      low: blocks.filter((b) => b.metadata?.estimatedComplexity === "low")
        .length,
      medium: blocks.filter((b) => b.metadata?.estimatedComplexity === "medium")
        .length,
      high: blocks.filter((b) => b.metadata?.estimatedComplexity === "high")
        .length,
    },
    allDependencies: blocks.flatMap((b) => b.metadata?.dependencies || []),
  };

  console.log("📈 Processing Statistics:", stats);
  return stats;
}

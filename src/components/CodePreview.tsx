/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { CodeBlock } from "@/types/chat";

interface CodePreviewProps {
  codeBlocks: CodeBlock[];
  isVisible: boolean;
  onClose: () => void;
}

export default function CodePreview({
  codeBlocks,
  isVisible,
  onClose,
}: CodePreviewProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"code" | "visual" | "split">(
    "visual"
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  if (!isVisible || codeBlocks.length === 0) return null;

  const selectedBlock =
    codeBlocks.find((block) => block.id === selectedBlockId) || codeBlocks[0];
  const languages = [...new Set(codeBlocks.map((block) => block.language))];
  const filteredBlocks =
    selectedLanguage === "all"
      ? codeBlocks
      : codeBlocks.filter((block) => block.language === selectedLanguage);

  const htmlBlock = codeBlocks.find(
    (block) => block.language.toLowerCase() === "html"
  );
  const cssBlock = codeBlocks.find(
    (block) => block.language.toLowerCase() === "css"
  );
  const jsBlock = codeBlocks.find(
    (block) => block.language.toLowerCase() === "javascript"
  );

  return (
    <div className=" bg-white flex-col rounded-lg border shadow-sm">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">🔍 Code Preview</h2>
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
            >
              {isSidebarVisible ? "◀️ Hide Sidebar" : "▶️ Show Sidebar"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Mode Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode("code")}
                className={`px-3 py-1 rounded text-sm ${
                  previewMode === "code" ? "bg-white shadow" : ""
                }`}
              >
                📝 Code
              </button>
              <button
                onClick={() => setPreviewMode("visual")}
                className={`px-3 py-1 rounded text-sm ${
                  previewMode === "visual" ? "bg-white shadow" : ""
                }`}
              >
                👁️ Visual
              </button>
              <button
                onClick={() => setPreviewMode("split")}
                className={`px-3 py-1 rounded text-sm ${
                  previewMode === "split" ? "bg-white shadow" : ""
                }`}
              >
                🔀 Split
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Code Block List */}
          {isSidebarVisible && (
            <div className="w-80 border-r overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold mb-3">
                  📦 Code Blocks ({filteredBlocks.length})
                </h3>
                <div className="space-y-2">
                  {filteredBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedBlock.id === block.id
                          ? "bg-blue-100 border-2 border-blue-300"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {getLanguageIcon(block.language)} {block.language}
                        </span>
                        <span className="text-xs text-gray-500">
                          {block.metadata?.lineCount || 0} lines
                        </span>
                      </div>

                      {block.filename && (
                        <div className="text-xs text-blue-600 mb-1 truncate">
                          📁 {block.filename}
                        </div>
                      )}

                      <div className="text-xs text-gray-600 line-clamp-2">
                        {block.code.substring(0, 100)}...
                      </div>

                      {/* Metadata badges */}
                      <div className="flex gap-1 mt-2">
                        {block.metadata?.hasImports && (
                          <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                            📥 Imports
                          </span>
                        )}
                        {block.metadata?.hasExports && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                            📤 Exports
                          </span>
                        )}
                        {block.metadata?.hasComments && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded">
                            💬 Comments
                          </span>
                        )}
                        <span
                          className={`text-xs px-1 rounded ${
                            block.metadata?.estimatedComplexity === "high"
                              ? "bg-red-100 text-red-700"
                              : block.metadata?.estimatedComplexity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {block.metadata?.estimatedComplexity || "low"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Preview Area */}
          <div className="flex-1 flex flex-col">
            {/* Selected Block Header */}
            <div className="p-4 border-b ">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {getLanguageIcon(selectedBlock.language)}{" "}
                    {selectedBlock.language}
                    {selectedBlock.filename && (
                      <span className="ml-2 text-blue-600">
                        📁 {selectedBlock.filename}
                      </span>
                    )}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedBlock.metadata?.lineCount || 0} lines • Complexity:{" "}
                    {selectedBlock.metadata?.estimatedComplexity || "low"}
                    {selectedBlock.metadata?.dependencies &&
                      selectedBlock.metadata.dependencies.length > 0 && (
                        <span>
                          {" "}
                          • Dependencies:{" "}
                          {selectedBlock.metadata.dependencies.join(", ")}
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(selectedBlock.code)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => downloadCode(selectedBlock)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    💾 Download
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden">
              {previewMode === "code" && <CodeView block={selectedBlock} />}

              {previewMode === "split" && (
                <div className="flex h-full">
                  <div className="w-1/2 border-r">
                    <CodeView block={selectedBlock} />
                  </div>
                  <div className="w-1/2">
                    {<VisualPreview block={selectedBlock} />}
                  </div>
                </div>
              )}

              {/* Combined live preview for HTML, CSS and JavaScript */}
              {previewMode === "visual" && (
                <VisualPreview block={selectedBlock} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LivepPreview({
  cssBlock,
  htmlBlock,
  jsBlock,
}: {
  htmlBlock: CodeBlock;
  cssBlock: CodeBlock;
  jsBlock: CodeBlock;
}) {
  return (
    <div className="h-full bg-white">
      <div className="p-4 border-b bg-gray-100">
        <h4 className="font-semibold">🌐 Combined Live Preview</h4>
      </div>
      <div className="p-4">
        <iframe
          srcDoc={`
    <html>
      <head>
        <style>${cssBlock?.code || ""}</style>
      </head>
      <body>
        ${htmlBlock?.code || ""}
        <script>${jsBlock?.code || ""}</script>
      </body>
    </html>
  `}
          className="w-full h-96 border rounded"
          sandbox="allow-scripts"
          title="Combined Code Preview"
        />
      </div>
    </div>
  );
}

// ===== CODE VIEW COMPONENT =====
function CodeView({ block }: { block: CodeBlock }) {
  return (
    <div className="h-full overflow-auto bg-gray-900 text-green-400 font-mono text-sm">
      <div className="p-4">
        <pre className="whitespace-pre-wrap">
          <code className={`language-${block.language}`}>
            {highlightCode(block.code, block.language)}
          </code>
        </pre>
      </div>
    </div>
  );
}

// ===== VISUAL PREVIEW COMPONENT =====
function VisualPreview({ block }: { block: CodeBlock }) {
  const [renderError, setRenderError] = useState<string | null>(null);

  // ===== VISUAL PREVIEW BASED ON LANGUAGE =====
  const renderVisualPreview = () => {
    try {
      switch (block.language.toLowerCase()) {
        case "html":
        case "css":
        case "javascript":
          return (
            <div className="h-full bg-white">
              <div className="p-4 border-b bg-gray-100">
                <h4 className="font-semibold">🌐 Live Preview</h4>
              </div>
              <div className="p-4">
                <iframe
                  srcDoc={block.code}
                  className="w-full h-96 border rounded"
                  sandbox="allow-scripts"
                  title="Code Preview"
                />
              </div>
            </div>
          );

        case "typescript":
          return (
            <div className="h-full bg-white overflow-auto">
              <div className="p-4 border-b bg-gray-100">
                <h4 className="font-semibold">
                  ⚡ JavaScript/TypeScript Analysis
                </h4>
              </div>
              <div className="p-4 space-y-4">
                <JSCodeAnalysis code={block.code} />
              </div>
            </div>
          );

        case "json":
          return (
            <div className="h-full bg-white overflow-auto">
              <div className="p-4 border-b bg-gray-100">
                <h4 className="font-semibold">📄 JSON Structure</h4>
              </div>
              <div className="p-4">
                <JSONVisualizer json={block.code} />
              </div>
            </div>
          );

        case "sql":
          return (
            <div className="h-full bg-white overflow-auto">
              <div className="p-4 border-b bg-gray-100">
                <h4 className="font-semibold">🗄️ SQL Analysis</h4>
              </div>
              <div className="p-4">
                <SQLAnalysis sql={block.code} />
              </div>
            </div>
          );

        case "python":
          return (
            <div className="h-full bg-white overflow-auto">
              <div className="p-4 border-b bg-gray-100">
                <h4 className="font-semibold">🐍 Python Code Analysis</h4>
              </div>
              <div className="p-4">
                <PythonAnalysis code={block.code} />
              </div>
            </div>
          );

        default:
          return (
            <div className="h-full bg-white overflow-auto">
              <div className="p-4">
                <GenericCodeAnalysis
                  code={block.code}
                  language={block.language}
                />
              </div>
            </div>
          );
      }
    } catch (error) {
      setRenderError(
        error instanceof Error ? error.message : "Rendering error"
      );
      return (
        <div className="h-full bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h4 className="text-red-700 font-semibold mb-2">Preview Error</h4>
            <p className="text-red-600 text-sm">{renderError}</p>
          </div>
        </div>
      );
    }
  };

  return renderVisualPreview();
}

// ===== JAVASCRIPT/TYPESCRIPT ANALYSIS =====
function JSCodeAnalysis({ code }: { code: string }) {
  const analysis = analyzeJSCode(code);

  return (
    <div className="space-y-4">
      {/* Functions */}
      {analysis.functions.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            ⚡ Functions ({analysis.functions.length})
          </h5>
          <div className="space-y-2">
            {analysis.functions.map((func, index) => (
              <div
                key={index}
                className="bg-blue-50 p-3 rounded border-l-4 border-blue-400"
              >
                <div className="font-mono text-sm text-blue-800">
                  {func.name}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Parameters: {func.params.join(", ") || "none"} • Type:{" "}
                  {func.type} • Lines: {func.lineCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variables */}
      {analysis.variables.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            📦 Variables ({analysis.variables.length})
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {analysis.variables.map((variable, index) => (
              <div key={index} className="bg-green-50 p-2 rounded text-sm">
                <span className="font-mono text-green-800">
                  {variable.name}
                </span>
                <span className="text-xs text-gray-600 ml-2">
                  ({variable.type})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Imports */}
      {analysis.imports.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            📥 Imports ({analysis.imports.length})
          </h5>
          <div className="space-y-1">
            {analysis.imports.map((imp, index) => (
              <div
                key={index}
                className="bg-purple-50 p-2 rounded text-sm font-mono"
              >
                <span className="text-purple-800">{imp.module}</span>
                {imp.items.length > 0 && (
                  <span className="text-gray-600 ml-2">
                    → {imp.items.join(", ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classes */}
      {analysis.classes.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            🏗️ Classes ({analysis.classes.length})
          </h5>
          <div className="space-y-2">
            {analysis.classes.map((cls, index) => (
              <div
                key={index}
                className="bg-orange-50 p-3 rounded border-l-4 border-orange-400"
              >
                <div className="font-mono text-sm text-orange-800">
                  {cls.name}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Methods: {cls.methods.length} • Properties:{" "}
                  {cls.properties.length}
                  {cls.extends && <span> • Extends: {cls.extends}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== JSON VISUALIZER =====
function JSONVisualizer({ json }: { json: string }) {
  try {
    const parsed = JSON.parse(json);
    return <JSONTree data={parsed} />;
  } catch (error) {
    return (
      <div className="bg-red-50 p-4 rounded">
        <div className="text-red-700 font-medium">Invalid JSON</div>
        <div className="text-red-600 text-sm mt-1">
          {error instanceof Error ? error.message : "Parse error"}
        </div>
      </div>
    );
  }
}

function JSONTree({ data, level = 0 }: { data: unknown; level?: number }) {
  const [collapsed, setCollapsed] = useState(level > 2);

  if (data === null) return <span className="text-gray-500">null</span>;
  if (typeof data === "string")
    return <span className="text-green-600">`{data}`</span>;
  if (typeof data === "number")
    return <span className="text-blue-600">{data}</span>;
  if (typeof data === "boolean")
    return <span className="text-purple-600">{data.toString()}</span>;

  if (Array.isArray(data)) {
    return (
      <div className="ml-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-800"
        >
          {collapsed ? "▶" : "▼"} Array ({data.length} items)
        </button>
        {!collapsed && (
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {data.map((item, index) => (
              <div key={index} className="py-1">
                <span className="text-gray-500">[{index}]:</span>
                <JSONTree data={item} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data as object);
    return (
      <div className="ml-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-800"
        >
          {collapsed ? "▶" : "▼"} Object ({keys.length} keys)
        </button>
        {!collapsed && (
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {keys.map((key) => (
              <div key={key} className="py-1">
                <span className="text-blue-800 font-medium">`{key}:</span>
                <JSONTree
                  data={(data as Record<string, unknown>)[key]}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span>{String(data)}</span>;
}

// ===== SQL ANALYSIS =====
function SQLAnalysis({ sql }: { sql: string }) {
  const analysis = analyzeSQLCode(sql);

  return (
    <div className="space-y-4">
      {/* Tables */}
      {analysis.tables.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            🗃️ Tables ({analysis.tables.length})
          </h5>
          <div className="space-y-2">
            {analysis.tables.map((table, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded">
                <div className="font-mono text-blue-800">{table.name}</div>
                {table.columns.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {table.columns.map((col, colIndex) => (
                      <div
                        key={colIndex}
                        className="text-xs bg-white p-1 rounded"
                      >
                        <span className="font-mono">{col.name}</span>
                        <span className="text-gray-600 ml-1">({col.type})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries */}
      {analysis.queries.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            🔍 Queries ({analysis.queries.length})
          </h5>
          <div className="space-y-2">
            {analysis.queries.map((query, index) => (
              <div key={index} className="bg-green-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {query.type}
                  </span>
                  <span className="text-sm text-gray-600">
                    Tables: {query.tables.join(", ")}
                  </span>
                </div>
                <div className="font-mono text-sm text-gray-700 bg-white p-2 rounded">
                  {query.preview}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== PYTHON ANALYSIS =====
function PythonAnalysis({ code }: { code: string }) {
  const analysis = analyzePythonCode(code);

  return (
    <div className="space-y-4">
      {/* Functions */}
      {analysis.functions.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            🐍 Functions ({analysis.functions.length})
          </h5>
          <div className="space-y-2">
            {analysis.functions.map((func, index) => (
              <div
                key={index}
                className="bg-blue-50 p-3 rounded border-l-4 border-blue-400"
              >
                <div className="font-mono text-sm text-blue-800">
                  def {func.name}({func.params.join(", ")})
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Lines: {func.lineCount}
                  {func.decorators.length > 0 && (
                    <span> • Decorators: {func.decorators.join(", ")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classes */}
      {analysis.classes.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            🏗️ Classes ({analysis.classes.length})
          </h5>
          <div className="space-y-2">
            {analysis.classes.map((cls, index) => (
              <div
                key={index}
                className="bg-orange-50 p-3 rounded border-l-4 border-orange-400"
              >
                <div className="font-mono text-sm text-orange-800">
                  class {cls.name}
                  {cls.inheritance.length > 0 &&
                    `(${cls.inheritance.join(", ")})`}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Methods: {cls.methods.length} • Attributes:{" "}
                  {cls.attributes.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Imports */}
      {analysis.imports.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 flex items-center gap-2">
            📥 Imports ({analysis.imports.length})
          </h5>
          <div className="space-y-1">
            {analysis.imports.map((imp, index) => (
              <div
                key={index}
                className="bg-purple-50 p-2 rounded text-sm font-mono"
              >
                <span className="text-purple-800">{imp.module}</span>
                {imp.alias && (
                  <span className="text-gray-600"> as {imp.alias}</span>
                )}
                {imp.items.length > 0 && (
                  <span className="text-gray-600">
                    {" "}
                    → {imp.items.join(", ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== GENERIC CODE ANALYSIS =====
function GenericCodeAnalysis({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const lines = code.split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const commentLines = lines.filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed.startsWith("//") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("<!--")
    );
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-600">{lines.length}</div>
          <div className="text-sm text-gray-600">Total Lines</div>
        </div>
        <div className="bg-green-50 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-600">
            {nonEmptyLines.length}
          </div>
          <div className="text-sm text-gray-600">Code Lines</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {commentLines.length}
          </div>
          <div className="text-sm text-gray-600">Comments</div>
        </div>
        <div className="bg-purple-50 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-600">
            {language.toUpperCase()}
          </div>
          <div className="text-sm text-gray-600">Language</div>
        </div>
      </div>

      {/* Line Length Distribution */}
      <div>
        <h5 className="font-medium mb-2">📏 Line Length Distribution</h5>
        <div className="space-y-1">
          {getLineLengthDistribution(lines).map((bucket, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm w-20">{bucket.range}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${bucket.percentage}%` }}
                />
              </div>
              <span className="text-sm w-12">{bucket.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Character Analysis */}
      <div>
        <h5 className="font-medium mb-2">🔤 Character Analysis</h5>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <div className="font-medium">Total Characters</div>
            <div className="text-lg">{code.length}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="font-medium">Whitespace</div>
            <div className="text-lg">{(code.match(/\s/g) || []).length}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="font-medium">Non-whitespace</div>
            <div className="text-lg">{code.replace(/\s/g, "").length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== UTILITY FUNCTIONS =====

function getLanguageIcon(language: string): string {
  const icons: Record<string, string> = {
    javascript: "🟨",
    typescript: "🔷",
    python: "🐍",
    java: "☕",
    html: "🌐",
    css: "🎨",
    sql: "🗄️",
    json: "📄",
    xml: "📋",
    yaml: "📝",
    markdown: "📖",
    bash: "💻",
    shell: "🐚",
    php: "🐘",
    ruby: "💎",
    go: "🐹",
    rust: "🦀",
    cpp: "⚙️",
    c: "🔧",
    csharp: "🔷",
    swift: "🍎",
    kotlin: "🟣",
    dart: "🎯",
    r: "📊",
    scala: "🔺",
    clojure: "🔄",
    haskell: "🎭",
    elm: "🌳",
    vue: "💚",
    react: "⚛️",
    angular: "🅰️",
    svelte: "🧡",
  };
  return icons[language.toLowerCase()] || "📄";
}

function highlightCode(code: string, language: string): string {
  // Simple syntax highlighting - in a real app, use a library like Prism.js
  let highlighted = code;

  // Keywords highlighting based on language
  const keywords: Record<string, string[]> = {
    javascript: [
      "function",
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "return",
      "class",
      "import",
      "export",
    ],
    typescript: [
      "function",
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "return",
      "class",
      "import",
      "export",
      "interface",
      "type",
    ],
    python: [
      "def",
      "class",
      "if",
      "else",
      "elif",
      "for",
      "while",
      "return",
      "import",
      "from",
      "try",
      "except",
    ],
    sql: [
      "SELECT",
      "FROM",
      "WHERE",
      "INSERT",
      "UPDATE",
      "DELETE",
      "CREATE",
      "TABLE",
      "INDEX",
      "JOIN",
    ],
  };

  const langKeywords = keywords[language.toLowerCase()] || [];

  langKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      `<span class="text-blue-600 font-semibold">${keyword}</span>`
    );
  });

  // String highlighting
  highlighted = highlighted.replace(
    /"([^"]*)"/g,
    '<span class="text-green-600">"$1"</span>'
  );
  highlighted = highlighted.replace(
    /'([^']*)'/g,
    "<span class=\"text-green-600\">'$1'</span>"
  );

  // Comment highlighting
  highlighted = highlighted.replace(
    /\/\/.*$/gm,
    '<span class="text-gray-500 italic">$&</span>'
  );
  highlighted = highlighted.replace(
    /#.*$/gm,
    '<span class="text-gray-500 italic">$&</span>'
  );

  return highlighted;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    // You could add a toast notification here
    console.log("Code copied to clipboard");
  });
}

function downloadCode(block: CodeBlock) {
  const filename = block.filename || `code.${getFileExtension(block.language)}`;
  const blob = new Blob([block.code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    html: "html",
    css: "css",
    sql: "sql",
    json: "json",
    xml: "xml",
    yaml: "yml",
    markdown: "md",
    bash: "sh",
    shell: "sh",
    php: "php",
    ruby: "rb",
    go: "go",
    rust: "rs",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    swift: "swift",
    kotlin: "kt",
    dart: "dart",
  };
  return extensions[language.toLowerCase()] || "txt";
}

function extractCSSRules(css: string) {
  const rules: Array<{ selector: string; properties: number }> = [];
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let match;

  while ((match = ruleRegex.exec(css)) !== null) {
    const selector = match[1].trim();
    const properties = match[2].split(";").filter((prop) => prop.trim()).length;
    rules.push({ selector, properties });
  }

  return rules;
}

function analyzeJSCode(code: string) {
  const functions: Array<{
    name: string;
    params: string[];
    type: string;
    lineCount: number;
  }> = [];
  const variables: Array<{ name: string; type: string }> = [];
  const imports: Array<{ module: string; items: string[] }> = [];
  const classes: Array<{
    name: string;
    methods: string[];
    properties: string[];
    extends?: string;
  }> = [];

  // Extract functions
  const functionRegex =
    /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>|(\w+)\s*:\s*(?:async\s+)?function\s*\(([^)]*)\))/g;
  let match;
  while ((match = functionRegex.exec(code)) !== null) {
    const name = match[1] || match[2] || match[4];
    const params = (match[3] || match[5] || "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const type = match[2] ? "arrow" : match[4] ? "method" : "function";
    functions.push({ name, params, type, lineCount: 1 });
  }

  // Extract variables
  const varRegex = /(?:const|let|var)\s+(\w+)/g;
  while ((match = varRegex.exec(code)) !== null) {
    variables.push({ name: match[1], type: "variable" });
  }

  // Extract imports
  const importRegex =
    /import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = importRegex.exec(code)) !== null) {
    const items = match[1]
      ? match[1].split(",").map((i) => i.trim())
      : match[2]
      ? [match[2]]
      : match[3]
      ? [match[3]]
      : [];
    imports.push({ module: match[4], items });
  }

  // Extract classes
  const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{([^}]+)\}/g;
  while ((match = classRegex.exec(code)) !== null) {
    const name = match[1];
    const extendsClass = match[2];
    const body = match[3];
    const methods = (body.match(/(\w+)\s*\(/g) || []).map((m) =>
      m.replace(/\s*\(/, "")
    );
    const properties = (body.match(/this\.(\w+)/g) || []).map((p) =>
      p.replace("this.", "")
    );
    classes.push({ name, methods, properties, extends: extendsClass });
  }

  return { functions, variables, imports, classes };
}

function analyzeSQLCode(sql: string) {
  const tables: Array<{
    name: string;
    columns: Array<{ name: string; type: string }>;
  }> = [];
  const queries: Array<{ type: string; tables: string[]; preview: string }> =
    [];

  // Extract CREATE TABLE statements
  const createTableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([^)]+)\)/gi;
  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsStr = match[2];
    const columns = columnsStr.split(",").map((col) => {
      const parts = col.trim().split(/\s+/);
      return { name: parts[0], type: parts[1] || "unknown" };
    });
    tables.push({ name: tableName, columns });
  }

  // Extract queries
  const queryRegex = /(SELECT|INSERT|UPDATE|DELETE)[^;]+/gi;
  while ((match = queryRegex.exec(sql)) !== null) {
    const queryText = match[0];
    const type = match[1].toUpperCase();
    const tableMatches =
      queryText.match(/(?:FROM|INTO|UPDATE|JOIN)\s+(\w+)/gi) || [];
    const tables = tableMatches.map((t) => t.split(/\s+/)[1]);
    queries.push({
      type,
      tables: [...new Set(tables)],
      preview:
        queryText.substring(0, 100) + (queryText.length > 100 ? "..." : ""),
    });
  }

  return { tables, queries };
}

function analyzePythonCode(code: string) {
  const functions: Array<{
    name: string;
    params: string[];
    lineCount: number;
    decorators: string[];
  }> = [];
  const classes: Array<{
    name: string;
    methods: string[];
    attributes: string[];
    inheritance: string[];
  }> = [];
  const imports: Array<{ module: string; alias?: string; items: string[] }> =
    [];

  // Extract functions
  const functionRegex = /(?:@(\w+)\s+)?def\s+(\w+)\s*\(([^)]*)\):/g;
  let match;
  while ((match = functionRegex.exec(code)) !== null) {
    const decorator = match[1];
    const name = match[2];
    const params = match[3]
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    functions.push({
      name,
      params,
      lineCount: 1,
      decorators: decorator ? [decorator] : [],
    });
  }

  // Extract classes
  const classRegex = /class\s+(\w+)(?:\(([^)]+)\))?:/g;
  while ((match = classRegex.exec(code)) !== null) {
    const name = match[1];
    const inheritance = match[2]
      ? match[2].split(",").map((i) => i.trim())
      : [];
    classes.push({ name, methods: [], attributes: [], inheritance });
  }

  // Extract imports
  const importRegex = /(?:from\s+(\w+)\s+)?import\s+([^#\n]+)/g;
  while ((match = importRegex.exec(code)) !== null) {
    const importedModule = match[1] || match[2].split(" ")[0];
    const items = match[1] ? match[2].split(",").map((i) => i.trim()) : [];
    imports.push({ module: importedModule, items });
  }

  return { functions, classes, imports };
}

function getLineLengthDistribution(lines: string[]) {
  const buckets = [
    { range: "0-20", min: 0, max: 20, count: 0 },
    { range: "21-40", min: 21, max: 40, count: 0 },
    { range: "41-60", min: 41, max: 60, count: 0 },
    { range: "61-80", min: 61, max: 80, count: 0 },
    { range: "81-100", min: 81, max: 100, count: 0 },
    { range: "100+", min: 101, max: Infinity, count: 0 },
  ];

  lines.forEach((line) => {
    const length = line.length;
    const bucket = buckets.find((b) => length >= b.min && length <= b.max);
    if (bucket) bucket.count++;
  });

  const total = lines.length;
  return buckets.map((bucket) => ({
    ...bucket,
    percentage: total > 0 ? (bucket.count / total) * 100 : 0,
  }));
}

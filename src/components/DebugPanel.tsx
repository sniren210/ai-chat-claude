import { useState } from "react";
import { ProcessingStats, ExtractionLog } from "@/types/chat";

interface DebugPanelProps {
  processingStats?: ProcessingStats;
  extractionLogs?: ExtractionLog[];
  isVisible?: boolean;
}

export default function DebugPanel({
  processingStats,
  extractionLogs,
  isVisible = false,
}: DebugPanelProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">🔍 Code Extraction Debug Panel</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-green-300 hover:text-green-100"
        >
          {showDetails ? "▼ Hide Details" : "▶ Show Details"}
        </button>
      </div>

      {/* ===== EXTRACTION SUMMARY ===== */}
      <div className="mb-4">
        <div className="text-yellow-400 mb-2">📊 EXTRACTION SUMMARY:</div>
        {processingStats && (
          <div className="pl-4 space-y-1">
            <div>
              ✅ Total Blocks Found:{" "}
              <span className="text-white">{processingStats.totalBlocks}</span>
            </div>
            <div>
              🔤 Languages Detected:{" "}
              <span className="text-white">
                {processingStats.languages.join(", ")}
              </span>
            </div>
            <div>
              📝 Total Lines:{" "}
              <span className="text-white">{processingStats.totalLines}</span>
            </div>
            <div>
              📁 Blocks with Files:{" "}
              <span className="text-white">
                {processingStats.blocksWithFiles}
              </span>
            </div>
            <div>
              📦 Blocks with Imports:{" "}
              <span className="text-white">
                {processingStats.blocksWithImports}
              </span>
            </div>
            <div>
              📤 Blocks with Exports:{" "}
              <span className="text-white">
                {processingStats.blocksWithExports}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ===== COMPLEXITY DISTRIBUTION ===== */}
      {processingStats && (
        <div className="mb-4">
          <div className="text-yellow-400 mb-2">
            📈 COMPLEXITY DISTRIBUTION:
          </div>
          <div className="pl-4 space-y-1">
            <div>
              🟢 Low:{" "}
              <span className="text-white">
                {processingStats.complexityDistribution.low}
              </span>
            </div>
            <div>
              🟡 Medium:{" "}
              <span className="text-white">
                {processingStats.complexityDistribution.medium}
              </span>
            </div>
            <div>
              🔴 High:{" "}
              <span className="text-white">
                {processingStats.complexityDistribution.high}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===== DEPENDENCIES ===== */}
      {processingStats && processingStats.allDependencies.length > 0 && (
        <div className="mb-4">
          <div className="text-yellow-400 mb-2">📦 DEPENDENCIES FOUND:</div>
          <div className="pl-4">
            <div className="text-white">
              {processingStats.allDependencies.join(", ")}
            </div>
          </div>
        </div>
      )}

      {/* ===== DETAILED LOGS ===== */}
      {showDetails && extractionLogs && (
        <div className="border-t border-gray-700 pt-4">
          <div className="text-yellow-400 mb-2">🔍 EXTRACTION LOGS:</div>
          {extractionLogs.map((log, index) => (
            <div key={index} className="pl-4 mb-3 border-l-2 border-gray-600">
              <div className="text-blue-400">
                📅 {log.timestamp.toLocaleTimeString()}
              </div>
              <div>
                📄 Input Length:{" "}
                <span className="text-white">{log.inputLength}</span>
              </div>
              <div>
                🔢 Blocks Found:{" "}
                <span className="text-white">{log.blocksFound}</span>
              </div>
              <div>
                🔤 Languages:{" "}
                <span className="text-white">{log.languages.join(", ")}</span>
              </div>
              <div>
                ⏱️ Processing Time:{" "}
                <span className="text-white">{log.processingTime}ms</span>
              </div>
              <div>
                🔧 Method: <span className="text-white">{log.method}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== EXTRACTION MARKERS ===== */}
      <div className="border-t border-gray-700 pt-4 text-xs">
        <div className="text-yellow-400 mb-2">
          🎯 EXTRACTION POINTS TRACKED:
        </div>
        <div className="pl-4 space-y-1 text-gray-400">
          <div>
            • ===== EXTRACTION POINT: Extract code blocks from response =====
          </div>
          <div>• ===== PROCESSING POINT: Generate statistics =====</div>
          <div>• ===== VALIDATION PHASE: Check code blocks =====</div>
          <div>• ===== RESPONSE PREPARATION POINT =====</div>
        </div>
      </div>
    </div>
  );
}

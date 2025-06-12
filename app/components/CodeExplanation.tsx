'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mermaid from 'mermaid';

interface ExplanationProps {
  code: string;
  language: string;
}

export default function CodeExplanation({ code, language }: ExplanationProps) {
  const [explanation, setExplanation] = useState<{
    summary: string;
    complexity: string;
    flowchart: string;
    recommendations: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mermaidError, setMermaidError] = useState<string | null>(null);

  // Initialize mermaid once when component mounts
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        securityLevel: 'loose',
        themeVariables: {
          fontFamily: 'inter',
          primaryColor: '#2B2FAB',
          primaryTextColor: '#F5F5F5',
          primaryBorderColor: '#2B2FAB',
          lineColor: '#F5F5F5',
          secondaryColor: '#00E5FF',
          tertiaryColor: '#1a1a1a',
        },
      });
    } catch (error) {
      console.error('Failed to initialize mermaid:', error);
    }
  }, []);

  // Render mermaid diagram
  const renderDiagram = useCallback(async (diagram: string) => {
    try {
      setMermaidError(null);
      const { svg } = await mermaid.render('mermaid-diagram', diagram);
      const container = document.getElementById('mermaid-container');
      if (container) {
        container.innerHTML = svg;
      }
    } catch (error) {
      console.error('Failed to render mermaid diagram:', error);
      setMermaidError('Failed to render flowchart. The diagram syntax might be invalid.');
    }
  }, []);

  // Update diagram when explanation changes
  useEffect(() => {
    if (explanation?.flowchart) {
      renderDiagram(explanation.flowchart);
    }
  }, [explanation?.flowchart, renderDiagram]);

  const generateExplanation = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setMermaidError(null);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate explanation');
      }
      
      const data = await response.json();
      if (!data.summary || !data.complexity || !data.flowchart || !data.recommendations) {
        throw new Error('Invalid explanation format received');
      }
      setExplanation(data);
    } catch (error) {
      console.error('Failed to generate explanation:', error);
      setMermaidError(error instanceof Error ? error.message : 'Failed to generate explanation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 glass-panel p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">AI Analysis</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn-secondary"
          onClick={generateExplanation}
          disabled={!code.trim() || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Explain Code'}
        </motion.button>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-8"
          >
            <div className="w-8 h-8 border-4 border-t-[var(--brand)] border-[var(--panel-border)] rounded-full animate-spin"></div>
          </motion.div>
        )}

        {mermaidError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] px-4 py-3 rounded-lg text-center"
          >
            {mermaidError}
          </motion.div>
        )}

        {explanation && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Summary */}
            <div className="glass-panel p-4">
              <h4 className="text-[var(--brand)] font-semibold mb-2">Summary</h4>
              <p className="text-[var(--text-secondary)]">{explanation.summary}</p>
            </div>

            {/* Complexity Analysis */}
            <div className="glass-panel p-4">
              <h4 className="text-[var(--brand)] font-semibold mb-2">Complexity Analysis</h4>
              <pre className="text-[var(--text-secondary)] font-mono text-sm whitespace-pre-wrap bg-[var(--background)] p-4 rounded-lg">
                {explanation.complexity}
              </pre>
            </div>

            {/* Flow Chart */}
            <div className="glass-panel p-4">
              <h4 className="text-[var(--brand)] font-semibold mb-2">Flow Chart</h4>
              <div className="bg-[var(--background)] p-4 rounded-lg overflow-auto">
                <div id="mermaid-container" className="flex justify-center"></div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-panel p-4">
              <h4 className="text-[var(--brand)] font-semibold mb-2">Recommendations</h4>
              <ul className="space-y-3">
                {explanation.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-[var(--text-secondary)] glass-panel p-3"
                  >
                    <span className="text-[var(--primary)] text-xl">✓</span>
                    <span>{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 
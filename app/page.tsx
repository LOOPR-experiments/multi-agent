'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ClipLoader } from 'react-spinners';
import { sampleCode } from './data/sampleCode';
import CollaborativeSession from './components/CollaborativeSession';
import CodeExplanation from './components/CodeExplanation';

// Supported languages and their display names
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'c', label: 'C' },
  { value: 'java', label: 'Java' },
  { value: 'solidity', label: 'Solidity (Eth)' },
  { value: 'rust', label: 'Rust (Sol)' },
];

// Analysis modes
const ANALYSIS_MODES = [
  { value: 'default', label: 'Default' },
  { value: 'security', label: 'Check Security Flaws' },
  { value: 'performance', label: 'Optimize Performance' },
  { value: 'readability', label: 'Improve Readability' },
  { value: 'all', label: 'All of the Above' },
];

export default function Home() {
  const [language, setLanguage] = useState(LANGUAGES[0].value);
  const [analysisMode, setAnalysisMode] = useState(ANALYSIS_MODES[0].value);
  const [code, setCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, analysisMode }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze code');
      }
      
      const data = await response.json();
      setOptimizedCode(data.optimizedCode);
    } catch (error) {
      console.error('Analysis failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to analyze code');
      setOptimizedCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedCode);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback method for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = optimizedCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleInsertSample = () => {
    const samples = sampleCode[language];
    if (samples && samples.length > 0) {
      const randomIndex = Math.floor(Math.random() * samples.length);
      setCode(samples[randomIndex].code);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Intro Section */}
      <section className="text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-4xl font-bold brand-gradient">
            Multi-agent Code Audit/Optimization
          </h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Audit Agent uses advanced AI to identify bugs, inefficiencies, and vulnerabilities in your code.
          </p>
          <p className="text-[var(--text-secondary)]">
            Simply paste your code below, select your preferences, and let our AI optimize it for you.
          </p>
        </motion.div>
      </section>

      {/* Control Bar */}
      <div className="glass-panel p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field interactive-hover min-w-40"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <select
            value={analysisMode}
            onChange={(e) => setAnalysisMode(e.target.value)}
            className="input-field interactive-hover min-w-40"
          >
            {ANALYSIS_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="btn-secondary pulse-on-hover"
            onClick={handleInsertSample}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Insert Random Sample
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="relative btn-secondary opacity-50"
            title="Coming soon!"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect (beta)
            </span>
          </motion.button>
        </div>
      </div>

      {/* Code Input */}
      <motion.div
        className="glass-panel neon-border"
        whileFocus={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--panel-border)]">
          <span className="text-[var(--text-secondary)] text-sm">Input Code</span>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-50"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-50"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 opacity-50"></span>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 bg-transparent border-none focus:outline-none text-[var(--text-primary)] font-mono resize-none p-4"
          placeholder="Paste your code here..."
        />
      </motion.div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn-primary pulse-on-hover px-8 py-3 text-lg"
          onClick={handleAnalyze}
          disabled={!code.trim() || isLoading}
        >
          <span className="flex items-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze & Optimize
              </>
            )}
          </span>
        </motion.button>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 my-8"
          >
            <ClipLoader color="var(--primary)" size={50} />
            <p className="text-[var(--text-secondary)]">Processing your code...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-panel border-[var(--accent)] text-[var(--accent)] p-4 text-center"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      {optimizedCode && !isLoading && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel neon-border overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--panel-border)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Before</h3>
                <span className="text-[var(--text-secondary)] text-sm px-3 py-1 rounded-full bg-[var(--panel)]">
                  Original Code
                </span>
              </div>
              <div className="relative">
                <SyntaxHighlighter
                  language={language}
                  style={dracula}
                  className="!bg-transparent !mt-0"
                  customStyle={{
                    padding: '1rem',
                    margin: 0,
                    borderRadius: '0',
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            </motion.div>

            {/* After Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel neon-border overflow-hidden relative"
            >
              <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--panel-border)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">After</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn-secondary text-sm"
                  onClick={handleCopy}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {showCopied ? 'Copied!' : 'Copy'}
                  </span>
                </motion.button>
              </div>
              <div className="relative">
                <SyntaxHighlighter
                  language={language}
                  style={dracula}
                  className="!bg-transparent !mt-0"
                  customStyle={{
                    padding: '1rem',
                    margin: 0,
                    borderRadius: '0',
                  }}
                >
                  {optimizedCode}
                </SyntaxHighlighter>
              </div>

              {/* Copy Tooltip */}
              <AnimatePresence>
                {showCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-14 right-4 glass-panel px-3 py-1 text-[var(--primary)]"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Code Explanation */}
          <CodeExplanation code={optimizedCode} language={language} />
        </div>
      )}

      {/* Collaborative Session */}
      <CollaborativeSession />
    </div>
  );
}

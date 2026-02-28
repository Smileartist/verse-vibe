import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Feather, History, Sparkles, BookOpen,
  Settings, Zap, MessageSquare, Wind, Eye,
  CheckCircle, AlertCircle, X, Clock,
  Type, WrapText, Cpu, ToggleLeft, ToggleRight, ChevronRight,
  Sun, Moon
} from 'lucide-react';
import './App.css';

// ─── Sentiment Theme Engine ─────────────────────────────────────────────────
// Each theme defines the full visual environment: orbs, overlay tint, accent
const sentimentThemes = {
  Melancholic: {
    orb1: 'rgba(96,165,250,0.5)',   // blue
    orb2: 'rgba(147,197,253,0.4)',
    orb3: 'rgba(59,130,246,0.3)',
    overlay: 'rgba(30,58,138,0.12)',
    accent: '#60a5fa',
    accentGlow: 'rgba(96,165,250,0.45)',
    border: 'rgba(96,165,250,0.3)',
    gradientBg: 'radial-gradient(ellipse at 20% 20%, rgba(30,58,138,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.2) 0%, transparent 60%)',
    badge: { bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.4)', text: '#93c5fd' },
  },
  Joyful: {
    orb1: 'rgba(251,191,36,0.55)',  // gold
    orb2: 'rgba(252,211,77,0.4)',
    orb3: 'rgba(245,158,11,0.35)',
    overlay: 'rgba(120,80,0,0.1)',
    accent: '#fbbf24',
    accentGlow: 'rgba(251,191,36,0.5)',
    border: 'rgba(251,191,36,0.3)',
    gradientBg: 'radial-gradient(ellipse at 30% 10%, rgba(120,80,0,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 90%, rgba(245,158,11,0.2) 0%, transparent 55%)',
    badge: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)', text: '#fde68a' },
  },
  Dark: {
    orb1: 'rgba(71,85,105,0.5)',   // slate
    orb2: 'rgba(51,65,85,0.4)',
    orb3: 'rgba(30,41,59,0.5)',
    overlay: 'rgba(0,0,0,0.2)',
    accent: '#94a3b8',
    accentGlow: 'rgba(148,163,184,0.3)',
    border: 'rgba(148,163,184,0.2)',
    gradientBg: 'radial-gradient(ellipse at 50% 50%, rgba(15,23,42,0.5) 0%, transparent 70%)',
    badge: { bg: 'rgba(100,116,139,0.15)', border: 'rgba(148,163,184,0.3)', text: '#cbd5e1' },
  },
  Energetic: {
    orb1: 'rgba(249,115,22,0.55)',  // orange
    orb2: 'rgba(251,146,60,0.4)',
    orb3: 'rgba(234,88,12,0.35)',
    overlay: 'rgba(120,40,0,0.1)',
    accent: '#fb923c',
    accentGlow: 'rgba(249,115,22,0.5)',
    border: 'rgba(249,115,22,0.3)',
    gradientBg: 'radial-gradient(ellipse at 80% 20%, rgba(120,40,0,0.3) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(234,88,12,0.2) 0%, transparent 55%)',
    badge: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', text: '#fed7aa' },
  },
  Peaceful: {
    orb1: 'rgba(52,211,153,0.45)',  // emerald
    orb2: 'rgba(110,231,183,0.35)',
    orb3: 'rgba(16,185,129,0.3)',
    overlay: 'rgba(0,60,40,0.1)',
    accent: '#34d399',
    accentGlow: 'rgba(52,211,153,0.45)',
    border: 'rgba(52,211,153,0.3)',
    gradientBg: 'radial-gradient(ellipse at 10% 80%, rgba(0,60,40,0.3) 0%, transparent 60%), radial-gradient(ellipse at 90% 20%, rgba(16,185,129,0.18) 0%, transparent 55%)',
    badge: { bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.35)', text: '#6ee7b7' },
  },
  Thoughtful: {
    orb1: 'rgba(167,139,250,0.45)',  // violet (default-ish)
    orb2: 'rgba(196,181,253,0.35)',
    orb3: 'rgba(139,92,246,0.3)',
    overlay: 'rgba(60,20,120,0.1)',
    accent: '#a78bfa',
    accentGlow: 'rgba(167,139,250,0.45)',
    border: 'rgba(167,139,250,0.3)',
    gradientBg: 'radial-gradient(ellipse at 20% 70%, rgba(60,20,120,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.18) 0%, transparent 55%)',
    badge: { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.4)', text: '#c4b5fd' },
  },
  Romantic: {
    orb1: 'rgba(244,114,182,0.5)',  // pink
    orb2: 'rgba(249,168,212,0.4)',
    orb3: 'rgba(236,72,153,0.3)',
    overlay: 'rgba(100,10,60,0.12)',
    accent: '#f472b6',
    accentGlow: 'rgba(244,114,182,0.5)',
    border: 'rgba(244,114,182,0.3)',
    gradientBg: 'radial-gradient(ellipse at 70% 10%, rgba(100,10,60,0.3) 0%, transparent 55%), radial-gradient(ellipse at 30% 90%, rgba(236,72,153,0.2) 0%, transparent 55%)',
    badge: { bg: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.4)', text: '#fbcfe8' },
  },
  Mysterious: {
    orb1: 'rgba(139,92,246,0.5)',  // purple
    orb2: 'rgba(109,40,217,0.35)',
    orb3: 'rgba(76,29,149,0.3)',
    overlay: 'rgba(30,0,70,0.15)',
    accent: '#8b5cf6',
    accentGlow: 'rgba(139,92,246,0.45)',
    border: 'rgba(139,92,246,0.3)',
    gradientBg: 'radial-gradient(ellipse at 50% 0%, rgba(30,0,70,0.4) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(76,29,149,0.25) 0%, transparent 55%)',
    badge: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', text: '#ddd6fe' },
  },
};

const defaultTheme = {
  orb1: 'rgba(167,139,250,0.35)',
  orb2: 'rgba(236,72,153,0.3)',
  orb3: 'rgba(59,130,246,0.25)',
  overlay: 'rgba(0,0,0,0)',
  accent: '#a78bfa',
  accentGlow: 'rgba(167,139,250,0.4)',
  border: 'rgba(167,139,250,0.3)',
  gradientBg: '',
  badge: { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.35)', text: '#c4b5fd' },
};

// ─── Animation variants ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const staggerContainer = {
  show: { transition: { staggerChildren: 0.09 } },
};

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
};

const toastVariant = {
  hidden: { opacity: 0, x: 80, scale: 0.9 },
  show: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } },
  exit: { opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.25 } },
};

// ─── Toast hook ─────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// ─── Analysis section component ─────────────────────────────────────────────
function AnalysisSection({ icon: Icon, title, content, accent }) {
  return (
    <motion.div
      variants={fadeUp}
      className="analysis-section"
      style={{ '--section-accent': accent }}
    >
      <div className="section-header">
        <div className="section-icon" style={{ background: `${accent}18`, color: accent }}><Icon size={14} /></div>
        <span className="section-title">{title}</span>
      </div>
      <p className="section-content">
        {content || <span style={{ opacity: 0.3, fontStyle: 'italic' }}>—</span>}
      </p>
    </motion.div>
  );
}

function ShimmerCard() {
  return (
    <motion.div variants={fadeUp} className="analysis-section">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="shimmer" style={{ width: '40%', marginBottom: 4 }} />
        <div className="shimmer" style={{ width: '90%' }} />
        <div className="shimmer" style={{ width: '75%' }} />
      </div>
    </motion.div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const [prevTheme, setPrevTheme] = useState(defaultTheme);
  const [activePanel, setActivePanel] = useState('analysis');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // ── Settings state ───────────────────────────────────────────────────────
  const [settings, setSettings] = useState({
    fontSize: 1.15,          // rem
    fontFamily: 'serif',     // 'serif' | 'sans'
    wordWrap: true,
    autoAnalyze: false,
    colorMode: 'dark',       // 'dark' | 'light'
  });

  const isLight = settings.colorMode === 'light';

  // Sync color mode to body so CSS can target body.light-mode for root bg
  useEffect(() => {
    document.body.classList.toggle('light-mode', isLight);
    return () => document.body.classList.remove('light-mode');
  }, [isLight]);

  const updateSetting = (key, value) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const words = useMemo(() => countWords(content), [content]);
  const chars = useMemo(() => content.length, [content]);

  // ── Update theme when result changes ────────────────────────────────────
  useEffect(() => {
    if (result?.sentiment) {
      const newTheme = sentimentThemes[result.sentiment] || defaultTheme;
      setPrevTheme(theme);
      setTheme(newTheme);
    }
  }, [result]);

  // ── Analyze ──────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!content.trim()) {
      addToast('Please write something first ✍️', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', { content });
      const rawData = response.data.analysis;
      const jsonMatch = rawData.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
        addToast(`Mood detected: ${parsed.sentiment} ✨`, 'success');
      } else {
        setResult({ sentiment: 'Thoughtful', suggestions: rawData, pacing: 'Natural flow.', wordChoice: '', tone: '' });
        addToast('Analysis complete!', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      const msg = error?.response?.data?.error || 'Backend unreachable. Check your terminal.';
      addToast(msg, 'error');
    }
    setLoading(false);
  };

  // ── History ──────────────────────────────────────────────────────────────
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:5000/history');
      setHistory(res.data.history || []);
    } catch {
      addToast('Could not load history', 'error');
    }
    setHistoryLoading(false);
  }, []);

  const handleHistoryClick = (item) => {
    setActivePanel('analysis');
    setContent(item.content);
    try {
      const jsonMatch = item.ai_feedback?.match(/\{[\s\S]*\}/);
      if (jsonMatch) setResult(JSON.parse(jsonMatch[0]));
    } catch { /* ignore */ }
    addToast('Manuscript loaded ✨', 'success');
  };

  useEffect(() => {
    if (activePanel === 'history') fetchHistory();
  }, [activePanel]);

  // Keep a stable ref to handleAnalyze so the keydown listener
  // never needs to be re-registered on every content change.
  const handleAnalyzeRef = useRef(handleAnalyze);
  useEffect(() => { handleAnalyzeRef.current = handleAnalyze; });
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleAnalyzeRef.current();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []); // ← empty dep: registered once, never torn down & rebuilt on keystrokes

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Dynamic background shell — animates on sentiment change ── */}
      <motion.div
        className="reactive-bg"
        animate={{ background: theme.gradientBg || 'radial-gradient(circle, transparent, transparent)' }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />

      {/* ── Animated overlay tint ── */}
      <motion.div
        className="reactive-overlay"
        animate={{ background: theme.overlay }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* ── Floating orbs with reactive colors ── */}
      <div className="orb-bg">
        <motion.div
          className="orb orb-1"
          animate={{ background: `radial-gradient(circle, ${theme.orb1}, transparent 70%)` }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.div
          className="orb orb-2"
          animate={{ background: `radial-gradient(circle, ${theme.orb2}, transparent 70%)` }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        />
        <motion.div
          className="orb orb-3"
          animate={{ background: `radial-gradient(circle, ${theme.orb3}, transparent 70%)` }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Toast container ── */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              variants={toastVariant}
              initial="hidden" animate="show" exit="exit"
              className={`toast ${t.type}`}
              style={t.type === 'success' ? { borderColor: theme.border } : {}}
            >
              {t.type === 'success'
                ? <CheckCircle size={16} style={{ color: theme.accent }} />
                : <AlertCircle size={16} color="#f87171" />}
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0 }}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── App Shell ── */}
      <div className={`app-shell${isLight ? ' light-mode' : ''}`}>

        {/* ── Sidebar with reactive accent ── */}
        <motion.aside
          className="sidebar"
          initial={{ x: -72, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.1 }}
        >
          {/* Logo with reactive glow */}
          <motion.div
            className="sidebar-logo"
            animate={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.orb2.replace('0.4)', '1)').replace('0.35)', '1)').replace('0.3)', '1)')})`,
              boxShadow: `0 0 30px ${theme.accentGlow}`,
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <Feather size={20} color="#fff" />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            className={`sidebar-btn ${activePanel === 'analysis' ? 'active' : ''}`}
            style={activePanel === 'analysis' ? { color: theme.accent, background: `${theme.accent}18` } : {}}
            onClick={() => setActivePanel('analysis')}
            title="Analysis"
          >
            <Sparkles size={19} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            className={`sidebar-btn ${activePanel === 'history' ? 'active' : ''}`}
            style={activePanel === 'history' ? { color: theme.accent, background: `${theme.accent}18` } : {}}
            onClick={() => setActivePanel('history')}
            title="History"
          >
            <History size={19} />
          </motion.button>

          <div className="sidebar-spacer" />

          <motion.button
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            className={`sidebar-btn ${activePanel === 'settings' ? 'active' : ''}`}
            style={activePanel === 'settings' ? { color: theme.accent, background: `${theme.accent}18` } : {}}
            onClick={() => setActivePanel(p => p === 'settings' ? 'analysis' : 'settings')}
            title="Settings"
          >
            <Settings size={18} />
          </motion.button>
        </motion.aside>

        {/* ── Main content ── */}
        <div className="main-content">

          {/* ── Header ── */}
          <motion.header
            className="app-header"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
          >
            <div className="header-brand">
              <motion.h1
                animate={{ backgroundImage: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.orb1.replace(/,\s*[\d.]+\)/, ', 1)')}, #fff 100%)` }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                VerseVibe
              </motion.h1>
              <p>AI-Powered Manuscript Analysis</p>
            </div>
            <div className="header-actions">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-secondary"
                style={{ borderColor: `${theme.accent}33`, color: `${theme.accent}cc` }}
                onClick={() => { setContent(''); setResult(null); setTheme(defaultTheme); }}
              >
                Clear
              </motion.button>
              {/* Publish button — commented out until publishing flow is implemented */}
              {/* <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-primary"
                animate={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.orb2.replace(/,\s*[\d.]+\)/, ', 1)')})`, boxShadow: `0 4px 20px ${theme.accentGlow}` }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              >
                Publish ✦
              </motion.button> */}
            </div>
          </motion.header>

          {/* ── Workspace ── */}
          <div className="workspace">

            {/* ── Editor ── */}
            <motion.div
              className="editor-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.25 }}
            >
              <div className="editor-meta">
                <span className="editor-title">Manuscript</span>
                <div className="editor-stats">
                  <span
                    className={`stat-chip ${words > 0 ? 'active' : ''}`}
                    style={words > 0 ? { color: theme.accent, borderColor: `${theme.accent}44`, background: `${theme.accent}10` } : {}}
                  >
                    {words} word{words !== 1 ? 's' : ''}
                  </span>
                  <span
                    className={`stat-chip ${chars > 0 ? 'active' : ''}`}
                    style={chars > 0 ? { color: theme.accent, borderColor: `${theme.accent}44`, background: `${theme.accent}10` } : {}}
                  >
                    {chars} char{chars !== 1 ? 's' : ''}
                  </span>
                  <span className="stat-chip">⌘↵ to analyze</span>
                </div>
              </div>

              {/* Editor card with reactive border glow */}
              <motion.div
                className="editor-card"
                animate={{ borderColor: loading ? theme.border : 'rgba(255,255,255,0.07)' }}
                transition={{ duration: 0.8 }}
                style={{ '--editor-accent': theme.accent }}
              >
                <motion.div
                  className="editor-focus-glow"
                  animate={{ boxShadow: loading ? `0 0 0 1px ${theme.border}, 0 25px 60px ${theme.accentGlow}` : '0 0 0 1px transparent' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  style={{ position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none' }}
                />
                <textarea
                  className="manuscript-textarea"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Start your masterpiece… let the words flow."
                  spellCheck
                  style={{
                    caretColor: theme.accent,
                    fontSize: `${settings.fontSize}rem`,
                    fontFamily: settings.fontFamily === 'serif'
                      ? "'Playfair Display', serif"
                      : "'Inter', sans-serif",
                    whiteSpace: settings.wordWrap ? 'pre-wrap' : 'pre',
                    overflowX: settings.wordWrap ? 'hidden' : 'auto',
                  }}
                />

                <AnimatePresence>
                  {loading && (
                    <motion.div
                      className="progress-bar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="progress-fill"
                        animate={{ background: `linear-gradient(to right, ${theme.accent}, ${theme.orb2.replace(/,\s*[\d.]+\)/, ', 1)')})` }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="editor-toolbar">
                  <span className="word-count-bar">
                    {words > 0 ? `~${Math.max(1, Math.round(words / 200))} min read` : 'Start writing…'}
                  </span>

                  <motion.button
                    className="analyze-btn"
                    onClick={handleAnalyze}
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.03 } : {}}
                    whileTap={!loading ? { scale: 0.96 } : {}}
                    animate={{
                      background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.orb2.replace(/,\s*[\d.]+\)/, ', 1)')} 100%)`,
                      boxShadow: `0 4px 24px ${theme.accentGlow}`,
                    }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  >
                    {loading ? (
                      <>
                        <div className="typing-dots">
                          <div className="typing-dot" />
                          <div className="typing-dot" />
                          <div className="typing-dot" />
                        </div>
                        <span>Buddy is reading…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={17} />
                        <span>Analyze Sentiment</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Analysis / History panel ── */}
            <motion.div
              className="analysis-panel"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.3 }}
            >
              <AnimatePresence mode="wait">

                {/* ── Settings ── */}
                {activePanel === 'settings' && (
                  <motion.div key="settings"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}
                  >
                    <span className="panel-label">Editor Settings</span>

                    {/* Font Size */}
                    <div className="settings-card">
                      <div className="settings-row">
                        <div className="settings-label">
                          <Type size={14} style={{ color: theme.accent }} />
                          <span>Font Size</span>
                        </div>
                        <span className="settings-value" style={{ color: theme.accent }}>
                          {settings.fontSize.toFixed(2)}rem
                        </span>
                      </div>
                      <input
                        type="range" min="0.9" max="1.6" step="0.05"
                        value={settings.fontSize}
                        onChange={e => updateSetting('fontSize', parseFloat(e.target.value))}
                        className="settings-slider"
                        style={{ '--thumb-color': theme.accent }}
                      />
                      <div className="settings-hint">
                        <span>A</span>
                        <span style={{ fontSize: '1.3em', fontWeight: 600 }}>A</span>
                      </div>
                    </div>

                    {/* Font Family */}
                    <div className="settings-card">
                      <div className="settings-row">
                        <div className="settings-label">
                          <Cpu size={14} style={{ color: theme.accent }} />
                          <span>Editor Font</span>
                        </div>
                      </div>
                      <div className="settings-toggle-group">
                        {['serif', 'sans'].map(f => (
                          <motion.button key={f}
                            className={`settings-toggle-btn ${settings.fontFamily === f ? 'active' : ''}`}
                            style={settings.fontFamily === f
                              ? { background: `${theme.accent}22`, borderColor: theme.border, color: theme.accent }
                              : {}}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => updateSetting('fontFamily', f)}
                          >
                            <span style={{ fontFamily: f === 'serif' ? "'Playfair Display', serif" : "'Inter', sans-serif" }}>
                              {f === 'serif' ? 'Playfair (Serif)' : 'Inter (Sans)'}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Word Wrap */}
                    <div className="settings-card">
                      <div className="settings-row">
                        <div className="settings-label">
                          <WrapText size={14} style={{ color: theme.accent }} />
                          <span>Word Wrap</span>
                        </div>
                        <motion.button className="settings-switch"
                          onClick={() => updateSetting('wordWrap', !settings.wordWrap)}
                          whileTap={{ scale: 0.92 }}>
                          {settings.wordWrap
                            ? <ToggleRight size={28} style={{ color: theme.accent }} />
                            : <ToggleLeft size={28} color="rgba(255,255,255,0.25)" />}
                        </motion.button>
                      </div>
                      <p className="settings-desc">Wrap long lines in the editor</p>
                    </div>

                    {/* Auto-Analyze */}
                    <div className="settings-card">
                      <div className="settings-row">
                        <div className="settings-label">
                          <Sparkles size={14} style={{ color: theme.accent }} />
                          <span>Auto-Analyze</span>
                          <span className="settings-badge">Soon</span>
                        </div>
                        <motion.button className="settings-switch"
                          onClick={() => updateSetting('autoAnalyze', !settings.autoAnalyze)}
                          whileTap={{ scale: 0.92 }}>
                          {settings.autoAnalyze
                            ? <ToggleRight size={28} style={{ color: theme.accent }} />
                            : <ToggleLeft size={28} color="rgba(255,255,255,0.25)" />}
                        </motion.button>
                      </div>
                      <p className="settings-desc">Analyze as you type (coming soon)</p>
                    </div>

                    {/* Color Mode */}
                    <div className="settings-card">
                      <div className="settings-row">
                        <div className="settings-label">
                          {isLight
                            ? <Sun size={14} style={{ color: theme.accent }} />
                            : <Moon size={14} style={{ color: theme.accent }} />}
                          <span>Color Mode</span>
                        </div>
                        <div className="mode-toggle" style={{ '--mode-accent': theme.accent }}>
                          <motion.button
                            className={`mode-btn ${!isLight ? 'active' : ''}`}
                            onClick={() => updateSetting('colorMode', 'dark')}
                            whileTap={{ scale: 0.93 }}
                            style={!isLight ? { background: `${theme.accent}22`, color: theme.accent, borderColor: theme.border } : {}}
                          >
                            <Moon size={12} />
                            Dark
                          </motion.button>
                          <motion.button
                            className={`mode-btn ${isLight ? 'active' : ''}`}
                            onClick={() => updateSetting('colorMode', 'light')}
                            whileTap={{ scale: 0.93 }}
                            style={isLight ? { background: `${theme.accent}22`, color: theme.accent, borderColor: theme.border } : {}}
                          >
                            <Sun size={12} />
                            Light
                          </motion.button>
                        </div>
                      </div>
                      <p className="settings-desc">Switch the editor appearance</p>
                    </div>

                    <div className="divider" />
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.5 }}>
                      VerseVibe · AI Manuscript Companion<br />
                      <span style={{ color: 'rgba(255,255,255,0.1)' }}>Powered by Gemini 2.5 Flash</span>
                    </p>
                  </motion.div>
                )}

                {/* ── History ── */}
                {activePanel === 'history' && (

                  <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                    <span className="panel-label">Recent Manuscripts</span>
                    {historyLoading ? (
                      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[1, 2, 3].map(i => <ShimmerCard key={i} />)}
                      </motion.div>
                    ) : history.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon"><Clock size={28} color="rgba(255,255,255,0.25)" /></div>
                        <p className="empty-title">No history yet</p>
                        <p className="empty-sub">Analyzed manuscripts appear here</p>
                      </div>
                    ) : (
                      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {history.map(item => (
                          <motion.div key={item.id} variants={slideIn} className="history-item"
                            onClick={() => handleHistoryClick(item)}
                            whileHover={{ scale: 1.01, borderColor: theme.border, background: `${theme.accent}09` }}
                            whileTap={{ scale: 0.99 }}>
                            <div className="history-item-title">{item.title}</div>
                            <div className="history-item-date">
                              {new Date(item.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ── Analysis ── */}
                {activePanel === 'analysis' && (
                  <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                    <span className="panel-label">Sentiment Analysis</span>

                    <AnimatePresence mode="wait">

                      {/* Shimmer loading */}
                      {loading && (
                        <motion.div key="shimmer" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0 }}
                          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <motion.div variants={fadeUp} className="sentiment-card">
                            <div className="shimmer" style={{ width: '35%', marginBottom: 14 }} />
                            <div className="shimmer" style={{ width: '60%', height: 32 }} />
                          </motion.div>
                          {[1, 2, 3].map(i => <ShimmerCard key={i} />)}
                        </motion.div>
                      )}

                      {/* Result with reactive colors */}
                      {!loading && result && (
                        <motion.div key="result" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0 }}
                          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                          {/* Sentiment card — fully reactive */}
                          <motion.div
                            variants={fadeUp}
                            className="sentiment-card"
                            animate={{
                              borderColor: theme.border,
                              boxShadow: `0 0 40px ${theme.accentGlow}`,
                            }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          >
                            {/* Inner glow */}
                            <motion.div
                              style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none' }}
                              animate={{ background: `radial-gradient(ellipse at top right, ${theme.accentGlow}, transparent 60%)` }}
                              transition={{ duration: 1.5, ease: 'easeInOut' }}
                            />

                            {/* Badge */}
                            <motion.div
                              className="sentiment-badge"
                              animate={{
                                background: theme.badge.bg,
                                borderColor: theme.badge.border,
                                color: theme.badge.text,
                              }}
                              transition={{ duration: 1, ease: 'easeInOut' }}
                            >
                              <motion.div
                                className="sentiment-dot"
                                animate={{ background: theme.accent }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                              />
                              Detected Mood
                            </motion.div>

                            {/* Sentiment value */}
                            <motion.div
                              className="sentiment-value"
                              key={result.sentiment}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              style={{ color: theme.accent }}
                            >
                              {result.sentiment}
                            </motion.div>
                          </motion.div>

                          <AnalysisSection icon={MessageSquare} title="Feedback" content={result.suggestions} accent={theme.accent} />
                          <AnalysisSection icon={Wind} title="Pacing" content={result.pacing} accent={theme.accent} />
                          {result.wordChoice && <AnalysisSection icon={Eye} title="Word Choice" content={result.wordChoice} accent={theme.accent} />}
                          {result.tone && <AnalysisSection icon={Zap} title="Tone" content={result.tone} accent={theme.accent} />}
                        </motion.div>
                      )}

                      {/* Empty state */}
                      {!loading && !result && (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="empty-state">
                          <motion.div
                            className="empty-icon"
                            animate={{ boxShadow: `0 0 30px ${theme.accentGlow}`, borderColor: theme.border }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          >
                            <BookOpen size={28} color="rgba(255,255,255,0.25)" />
                          </motion.div>
                          <p className="empty-title">Waiting for your verse</p>
                          <p className="empty-sub">
                            Write something, then hit<br />
                            <motion.span
                              className="highlight-pill"
                              animate={{ background: `${theme.accent}22`, color: theme.accent }}
                              transition={{ duration: 1.5 }}
                            >
                              Analyze Sentiment
                            </motion.span>
                          </p>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}
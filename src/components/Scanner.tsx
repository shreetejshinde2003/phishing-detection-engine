import { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, Loader2, Trash2, Clock, ChevronRight, Download, FileText } from 'lucide-react';

interface ScanHistoryItem {
  id: string;
  timestamp: number;
  text: string;
  result: AnalysisResult;
}

const CircularProgress = ({ score }: { score: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let colorClass = 'text-emerald-400';
  let glowClass = 'drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]';
  
  if (score >= 90) {
    colorClass = 'text-rose-500';
    glowClass = 'drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  } else if (score >= 75) {
    colorClass = 'text-amber-500';
    glowClass = 'drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]';
  } else if (score >= 40) {
    colorClass = 'text-amber-400';
    glowClass = 'drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]';
  }

  return (
    <div className={`relative flex items-center justify-center w-28 h-28 ${glowClass}`}>
      <svg className="transform -rotate-90 w-28 h-28">
        <circle cx="56" cy="56" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
        <circle 
          cx="56" cy="56" r="45" 
          stroke="currentColor" strokeWidth="6" fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          className={`transition-all duration-1000 ease-out ${colorClass}`} 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold font-mono ${colorClass}`}>{score}</span>
        <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">Risk</span>
      </div>
    </div>
  );
};

export default function Scanner() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phishguard_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const saveToHistory = (newResult: AnalysisResult, scannedText: string) => {
    const newItem: ScanHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      text: scannedText,
      result: newResult,
    };
    
    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 5);
      localStorage.setItem('phishguard_history', JSON.stringify(updated));
      return updated;
    });
  };

  const loadFromHistory = (item: ScanHistoryItem) => {
    setText(item.text);
    setResult(item.result);
    setError('');
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError('');
  };

  const downloadJsonAuditLog = () => {
    if (!result) return;
    const auditData = {
      timestamp: new Date().toISOString(),
      inputText: text,
      riskScore: result.riskScore,
      indicators: result.indicators,
      explanation: result.explanation,
      latencyMs: result.latencyMs,
      model: result.model
    };
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishguard_audit_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadTextSummary = () => {
    if (!result) return;
    const summary = `
=============================================
PHISHGUARD INCIDENT TICKET SUMMARY
=============================================
Date: ${new Date().toLocaleString()}
Risk Score: ${result.riskScore}/100
Model: ${result.model || 'Unknown'} (Latency: ${result.latencyMs || 'Unknown'}ms)

--- DETECTED INDICATORS ---
${result.indicators.length > 0 ? result.indicators.map(i => '- [' + i.mitreId + '] ' + i.description).join('\n') : 'None detected.'}

--- ANALYSIS EXPLANATION ---
${result.explanation}

--- ORIGINAL INPUT ---
${text}
=============================================
`.trim();

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishguard_ticket_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const startTime = Date.now();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        if (response.status === 429) {
           const errData = await response.json();
           throw new Error(errData.error || 'Rate limit reached');
        }
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;
      const newResult = {
        ...data,
        latencyMs,
      };
      
      const finalInputText = data.sanitizedText || text;
      setText(finalInputText);
      setResult(newResult);
      saveToHistory(newResult, finalInputText);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-emerald-400';
    if (score < 75) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3 space-y-6">
        <div className={`grid grid-cols-1 ${result ? 'lg:grid-cols-2' : ''} gap-6 transition-all`}>
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-sm p-6 flex flex-col min-h-[400px]">
            <h2 className="text-xl font-semibold text-zinc-200 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Email Analysis Engine
            </h2>
            <p className="text-sm text-zinc-400 mb-4 font-mono">
              Paste suspicious email content below to analyze for phishing indicators, urgency markers, and typosquatting attempts.
            </p>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste email headers and body here..."
              className="w-full flex-grow bg-black/50 border border-zinc-800 rounded-sm p-4 text-zinc-300 font-mono text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all resize-none min-h-[200px]"
            />
            
            {error && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-5 py-2 rounded-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]"
              >
                <Trash2 className="w-4 h-4" />
                Clear Input
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 disabled:border-zinc-800 disabled:bg-zinc-800/50 disabled:text-zinc-500 px-6 py-2 rounded-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Run Scan'
                )}
              </button>
            </div>
          </div>

          {loading && !result && (
            <div className="border border-zinc-800 rounded-sm p-12 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-md text-center animate-pulse min-h-[400px]">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
              <div className="text-lg font-medium text-zinc-300 font-mono">Analyzing Email...</div>
              <div className="text-sm text-zinc-500 mt-2 font-mono">Checking for phishing indicators and running heuristic scans</div>
            </div>
          )}

          {!loading && result && (
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-sm p-6 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                  <CircularProgress score={result.riskScore} />
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-200">Analysis Report</h3>
                    {result.latencyMs && result.model && (
                      <div className="flex items-center gap-2 text-xs font-medium font-mono mt-2">
                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded-sm">
                          {result.model}
                        </span>
                        <span className="bg-black text-zinc-400 border border-zinc-700 px-2 py-1 rounded-sm">
                          {result.latencyMs}ms
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button
                    onClick={downloadJsonAuditLog}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-black hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-sm text-xs font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] w-full"
                  >
                    <Download className="w-3.5 h-3.5" />
                    JSON Audit
                  </button>
                  <button
                    onClick={downloadTextSummary}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-sm text-xs font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] w-full"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Export Ticket
                  </button>
                </div>
              </div>
              
              <p className="text-zinc-300 font-mono text-sm leading-relaxed mb-6">
                {result.explanation}
              </p>
              
              <h4 className="text-sm font-medium text-zinc-400 font-mono uppercase tracking-wider mb-3">Detected Indicators</h4>
              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {result.indicators.length > 0 ? (
                  <ul className="space-y-3">
                    {result.indicators.map((indicator, idx) => {
                      const isHighSeverity = result.riskScore >= 75;
                      const badgeColor = isHighSeverity ? 'text-rose-400 border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)]' : 'text-amber-400 border-amber-500/50 shadow-[0_0_8px_rgba(251,191,36,0.3)]';
                      
                      return (
                        <li key={idx} className="flex flex-col gap-2 bg-black border border-zinc-800 p-3.5 rounded-sm">
                          {indicator.mitreId && (
                            <div className="flex items-center">
                              <span className={`text-[10px] font-bold font-mono bg-black border px-2 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}>
                                {indicator.mitreId}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-mono text-zinc-300 leading-relaxed">
                            {indicator.description}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-sm font-mono text-zinc-500 italic p-4 bg-black border border-zinc-800 rounded-sm">No specific indicators detected.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="xl:col-span-1 space-y-4">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-sm p-5">
           <h3 className="font-semibold text-zinc-200 mb-4 flex items-center gap-2">
             <Clock className="w-4 h-4 text-zinc-400" />
             Scan History
           </h3>
           <div className="space-y-3 font-mono">
             {history.length === 0 ? (
               <div className="text-sm text-zinc-500 italic">No recent scans.</div>
             ) : (
               history.map(item => (
                 <button 
                   key={item.id} 
                   onClick={() => loadFromHistory(item)} 
                   className="w-full text-left bg-black hover:bg-zinc-900 border border-zinc-800 p-3 rounded-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] flex items-center justify-between group"
                 >
                   <div className="overflow-hidden">
                     <div className="text-sm text-zinc-300 font-medium truncate pr-4">
                        {new Date(item.timestamp).toLocaleTimeString()}
                     </div>
                     <div className={`text-xs mt-1 font-semibold ${getRiskColor(item.result.riskScore)}`}>
                        Risk Score: {item.result.riskScore}
                     </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                 </button>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
}


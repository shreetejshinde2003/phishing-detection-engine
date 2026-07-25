import { useState, useEffect } from 'react';
import { TrainingScenario, MaliciousElement } from '../types';
import { Target, Loader2, AlertCircle, CheckCircle2, XCircle, ChevronDown, Terminal } from 'lucide-react';

const Typewriter = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

export default function Training() {
  const [scenario, setScenario] = useState<TrainingScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [difficulty, setDifficulty] = useState('Level 1: Mass Phishing');
  const difficulties = [
    'Level 1: Mass Phishing',
    'Level 2: Targeted Spear Phishing',
    'Level 3: Executive BEC / Zero-Day'
  ];

  const [selectedTokens, setSelectedTokens] = useState<Map<string, string>>(new Map());
  const [isGraded, setIsGraded] = useState(false);
  const [caughtElements, setCaughtElements] = useState<MaliciousElement[]>([]);
  const [missedElements, setMissedElements] = useState<MaliciousElement[]>([]);

  const generateScenario = async () => {
    setLoading(true);
    setError('');
    setScenario(null);
    setIsGraded(false);
    setSelectedTokens(new Map());
    setCaughtElements([]);
    setMissedElements([]);
    
    try {
      const response = await fetch('/api/generate-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          seed: Math.random().toString(36).substring(7),
          difficulty 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }

      const data = await response.json();
      setScenario(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string, token: string) => {
    if (isGraded) return;
    setSelectedTokens(prev => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, token);
      }
      return next;
    });
  };

  const handleGrade = () => {
    if (!scenario) return;
    
    const selectedWords = Array.from(selectedTokens.values()).map(w => w.toLowerCase());
    const joinedSelected = selectedWords.join('');

    const caught: MaliciousElement[] = [];
    const missed: MaliciousElement[] = [];

    scenario.maliciousElements.forEach(el => {
      const elLower = el.element.toLowerCase();
      const elStripped = elLower.replace(/\s+/g, '');
      
      let isCaught = false;

      // 1. Exact or near-exact containment of the stripped element in the joined selected text
      if (joinedSelected.includes(elStripped)) {
        isCaught = true;
      }
      
      // 2. If the element is long enough, check if any single selected word is a significant substring (e.g. > 50% match)
      if (!isCaught) {
        isCaught = selectedWords.some(word => {
          if (word.length < 4) return false;
          if (elStripped.includes(word) && word.length >= elStripped.length * 0.5) return true;
          if (word.includes(elStripped) && elStripped.length >= word.length * 0.5) return true;
          return false;
        });
      }

      // 3. Fallback for multi-word elements: check if > 50% of significant words (length >= 3) are selected, OR if ANY highly significant word (> 5 chars) is selected
      if (!isCaught) {
        const words = elLower.split(/\s+/).filter(w => w.length >= 3);
        if (words.length > 0) {
          const matchedWords = words.filter(w => joinedSelected.includes(w));
          if (matchedWords.length / words.length >= 0.5 || matchedWords.some(w => w.length >= 5)) {
            isCaught = true;
          }
        }
      }

      if (isCaught) {
        caught.push(el);
      } else {
        missed.push(el);
      }
    });

    setCaughtElements(caught);
    setMissedElements(missed);
    setIsGraded(true);
  };

  const TokenizedText = ({ text, type }: { text: string, type: string }) => {
    const tokens = text.split(/(\s+)/);
    return (
      <>
        {tokens.map((token, i) => {
          if (!token.trim()) return <span key={i}>{token}</span>;
          const id = `${type}-${i}`;
          const isSelected = selectedTokens.has(id);
          return (
            <span 
              key={id} 
              role="button"
              tabIndex={0}
              onClick={() => toggleSelection(id, token)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSelection(id, token);
                }
              }}
              className={`cursor-pointer px-0.5 transition-all ${isSelected ? 'bg-cyan-400 text-black font-bold shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'hover:bg-cyan-500/30 hover:text-cyan-200'}`}
            >
              {token}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-sm">
        <div>
          <h2 className="text-xl font-semibold text-zinc-200 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            SOC Analyst Training
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Test your skills against synthetic, AI-generated spear-phishing scenarios.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full appearance-none bg-black/50 border border-zinc-700 text-zinc-300 py-2 pl-4 pr-10 rounded-sm focus:outline-none focus:border-cyan-500 text-sm font-medium font-mono"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
          <button
            onClick={generateScenario}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 disabled:border-zinc-800 disabled:bg-zinc-800/50 disabled:text-zinc-500 px-5 py-2 rounded-sm font-medium font-mono transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:hover:scale-100 disabled:hover:shadow-none shrink-0 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Scenario'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-sm flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {scenario && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="col-span-1 xl:col-span-2 bg-black border border-zinc-800 rounded-sm overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center gap-2">
              <div className="flex gap-1.5 px-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="mx-auto flex items-center gap-2 text-xs font-mono text-zinc-500">
                <Terminal className="w-3.5 h-3.5" />
                bash - forensic_analysis_tool - 80x24
              </div>
            </div>
            
            <div className="border-b border-zinc-800 p-4 bg-black/50 space-y-2">
              <div className="flex items-start gap-4 text-sm">
                <span className="text-zinc-500 font-medium w-16">From:</span>
                <span className="text-zinc-300 font-mono">
                   <TokenizedText text={scenario.sender} type="sender" />
                </span>
              </div>
              <div className="flex items-start gap-4 text-sm">
                <span className="text-zinc-500 font-medium w-16">Subject:</span>
                <span className="text-zinc-200 font-medium font-mono">
                   <TokenizedText text={scenario.subject} type="subject" />
                </span>
              </div>
            </div>
            <div className="p-6 bg-black flex-grow">
              <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                <TokenizedText text={scenario.body} type="body" />
              </pre>
            </div>
          </div>

          <div className="col-span-1 bg-black border border-zinc-800 rounded-sm p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-mono font-semibold text-cyan-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                ANALYSIS_MODULE
              </h3>
            </div>

            {isGraded ? (
              <div className="space-y-6">
                <div className="bg-black border border-zinc-800 p-4 rounded-sm text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                  <div className="text-2xl font-bold font-mono text-cyan-400 mb-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                    {caughtElements.length}/{scenario.maliciousElements.length}
                  </div>
                  <div className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest">
                    Threat Vectors Caught
                  </div>
                </div>

                <div className="space-y-4">
                  {caughtElements.map((item, idx) => (
                    <div key={'caught-'+idx} className="bg-emerald-500/5 border border-emerald-500/30 p-4 rounded-sm shadow-[0_0_15px_rgba(52,211,153,0.15)] animate-pulse-slow">
                      <div className="text-emerald-400 font-mono text-sm mb-2 break-all font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
                        &gt; {item.element}
                      </div>
                      <div className="text-zinc-400 font-mono text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <Typewriter text={item.reason} />
                      </div>
                    </div>
                  ))}
                  
                  {missedElements.map((item, idx) => (
                    <div key={'missed-'+idx} className="bg-rose-500/5 border border-rose-500/40 p-4 rounded-sm shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                      <div className="text-rose-400 font-mono text-sm mb-2 break-all font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.5)] flex items-center justify-between animate-pulse-fast">
                         <span>&gt; {item.element}</span>
                         <span className="text-[10px] uppercase font-bold font-mono bg-rose-500/20 px-2 py-0.5 rounded-sm border border-rose-500/50 text-rose-300">MISSED</span>
                      </div>
                      <div className="text-zinc-400 font-mono text-xs flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <Typewriter text={item.reason} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border border-zinc-800 bg-zinc-900/30 rounded-sm">
                <AlertCircle className="w-8 h-8 text-cyan-400 mb-3 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <h4 className="text-cyan-400 font-mono font-bold mb-2 uppercase tracking-widest">Identify IOCs</h4>
                <p className="text-xs text-zinc-500 mb-6 font-mono leading-relaxed">
                  Select suspicious tokens in the forensic view. Grade when complete.
                </p>
                <button
                  onClick={handleGrade}
                  disabled={selectedTokens.size === 0}
                  className="w-full flex items-center justify-center bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 disabled:border-zinc-800 disabled:bg-zinc-800/50 disabled:text-zinc-500 px-4 py-2.5 rounded-sm font-bold font-mono transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:hover:scale-100 disabled:hover:shadow-none uppercase tracking-widest"
                >
                  [ Grade Analysis ]
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

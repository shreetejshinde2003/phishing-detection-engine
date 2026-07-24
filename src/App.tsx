import { useState } from 'react';
import Scanner from './components/Scanner';
import Training from './components/Training';
import { Shield, Target, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'training'>('scanner');

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-cyan-500/30">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 p-2 rounded-sm border border-cyan-500/20">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  PhishGuard
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium -mt-1">
                  Detection Engine
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-black p-1 rounded-sm border border-zinc-800">
              <button
                onClick={() => setActiveTab('scanner')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  activeTab === 'scanner'
                    ? 'bg-zinc-800 text-zinc-200 shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                    : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 hover:shadow-[0_0_10px_rgba(255,255,255,0.02)]'
                }`}
              >
                <Shield className="w-4 h-4" />
                Scanner
              </button>
              <button
                onClick={() => setActiveTab('training')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  activeTab === 'training'
                    ? 'bg-zinc-800 text-zinc-200 shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                    : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 hover:shadow-[0_0_10px_rgba(255,255,255,0.02)]'
                }`}
              >
                <Target className="w-4 h-4" />
                SOC Training
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'scanner' ? <Scanner /> : <Training />}
      </main>
    </div>
  );
}

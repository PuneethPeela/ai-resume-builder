"use client";

import { 
  ArrowUp, 
  History, 
  MoreVertical, 
  MessageSquare, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  Zap 
} from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="absolute inset-0 flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col w-[260px] border-r border-white/5 bg-slate-900/40 backdrop-blur-xl z-20">
        <div className="p-4 border-b border-white/5">
          <button className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-4 mb-8">
            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-1">Suggested Prompts</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all group">
                <p className="text-xs text-slate-300 group-hover:text-slate-100 leading-relaxed line-clamp-2">
                  Optimize my summary for a Senior PM role...
                </p>
              </button>
              <button className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all group">
                <p className="text-xs text-slate-300 group-hover:text-slate-100 leading-relaxed line-clamp-2">
                  Check my ATS keyword match for...
                </p>
              </button>
            </div>
          </div>

          <div className="px-4">
            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-1">Recent Chats</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 text-left p-2.5 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-sm truncate">Tech Lead Resume Review</span>
              </button>
              <button className="w-full flex items-center gap-3 text-left p-2.5 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-sm truncate">Cover Letter for Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-black relative">
        {/* Subtle background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.15)]">
              <BrainCircuit className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-white tracking-wide">Nexus AI</h2>
              <p className="text-[11px] text-violet-400 font-medium tracking-wide">Professional Resume Architect</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors md:hidden">
              <History className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth z-10">
          {/* AI Greeting */}
          <div className="flex gap-4 max-w-3xl mx-auto w-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-violet-600/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/40 border border-white/5 rounded-2xl rounded-tl-sm p-4 sm:p-5 text-slate-200 text-[15px] shadow-sm leading-relaxed backdrop-blur-sm">
              Hello! I'm Nexus, your professional resume architect. I can analyze your resume against job descriptions, suggest high-impact bullet points, or help you tailor your experience for a specific role. How can we elevate your profile today?
            </div>
          </div>

          {/* User Message */}
          <div className="flex gap-4 max-w-3xl mx-auto w-full flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-semibold text-white">US</span>
            </div>
            <div className="bg-violet-600 rounded-2xl rounded-tr-sm p-4 sm:p-5 text-white text-[15px] shadow-md shadow-violet-900/20 leading-relaxed">
              Can you analyze my current resume draft against an ATS for a 'Senior Full Stack Developer' role? Specifically looking at keyword density and action verbs.
            </div>
          </div>

          {/* AI Response with Progress Box */}
          <div className="flex gap-4 max-w-3xl mx-auto w-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-violet-600/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="w-full space-y-4">
              {/* Complex component mock */}
              <div className="bg-slate-900/60 border border-violet-500/20 rounded-2xl rounded-tl-sm overflow-hidden shadow-xl shadow-violet-900/10 backdrop-blur-md">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-violet-500/10 border-b border-violet-500/10">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span className="text-[11px] font-bold text-violet-300 tracking-widest">ANALYZING ATS FIT</span>
                </div>
                
                <div className="p-5 sm:p-6 space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[15px] font-medium text-slate-200">Scanning Draft vs. Target Role...</span>
                    <span className="text-base font-bold text-violet-400">68%</span>
                  </div>
                  
                  {/* Progress Items */}
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-slate-300">Keyword Match</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Strong</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-[85%] shadow-[0_0_10px_rgba(52,211,153,0.4)]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin"></div>
                          </div>
                          <span className="text-sm font-medium text-slate-300">Action Verb Impact</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider animate-pulse">Analyzing...</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full w-[45%] shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-1000 ease-out"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-950/50 px-5 py-3 border-t border-white/5 text-[13px] text-slate-400 flex items-center gap-2.5">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500/80 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500/80 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500/80 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  Synthesizing recommendations...
                </div>
              </div>
            </div>
          </div>
          
          {/* Empty space at bottom to ensure scroll passes the input */}
          <div className="h-4"></div>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:px-6 sm:pb-6 bg-transparent shrink-0 relative z-20">
          <div className="max-w-3xl mx-auto w-full relative">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-2xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur"></div>
              <div className="relative flex items-center bg-slate-900 border border-slate-700 hover:border-slate-600 focus-within:border-violet-500/50 rounded-2xl px-3 py-2.5 shadow-lg transition-all">
                <input 
                  type="text" 
                  placeholder="Ask anything in English, Telugu, or Hindi..." 
                  className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none focus:ring-0 text-[15px] px-2"
                />
                <button className="flex-shrink-0 ml-2 w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
            <p className="text-center text-[11px] text-slate-500 mt-3 font-medium tracking-wide">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

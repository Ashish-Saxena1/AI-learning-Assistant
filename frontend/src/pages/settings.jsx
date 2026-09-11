import React from 'react'
import Sidebar from '../components/sidebar'
import { THEMES } from '../constants'
import { useThemeStore } from '../store/useThemeStore'
import { Palette, Sparkles, CheckCircle2 } from 'lucide-react'

const Settings = () => {
  const { theme, setTheme } = useThemeStore();

  return (
        <div className="h-screen w-full bg-base-100 flex font-sans transition-all duration-300 antialiased overflow-hidden">
    
      
      
        
        <div className="w-[18%] min-w-55 max-w-70 hidden md:block border-r border-base-content/5 bg-base-100 h-full shrink-0">
                <Sidebar />
            </div>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
          
          <header className="mb-12 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary animate-pulse">
                <Palette size={24} />
              </div>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Style Center</p>
            </div>
            
            <h1 className="text-5xl font-black text-base-content tracking-tight">
              Pick Your <span className="text-primary underline decoration-dotted decoration-2 underline-offset-8">Vibe</span>
            </h1>
            
            <p className="text-base-content/60 mt-6 text-lg max-w-md leading-relaxed">
              Transform your workspace with one click. Every theme is crafted for focus.
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`
                  relative group flex flex-col p-6 rounded-[2.5rem] transition-all duration-300 ease-out
                  ${theme === t 
                    ? "bg-primary/5 ring-4 ring-primary/20 scale-105" 
                    : "bg-base-200/50 hover:bg-base-200 hover:-translate-y-2 hover:shadow-xl"
                  }
                `}
              >
                {theme === t && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-content rounded-full p-1.5 shadow-lg z-10 animate-bounce">
                    <CheckCircle2 size={16} />
                  </div>
                )}

                <div className="relative h-24 w-full rounded-2xl overflow-hidden mb-5 shadow-inner" data-theme={t}>
                  <div className="absolute inset-0 p-4 flex flex-col gap-3 bg-base-100">
                    <div className="flex gap-2">
                      <div className="w-10 h-2.5 rounded-full bg-primary"></div>
                      <div className="w-5 h-2.5 rounded-full bg-secondary"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-1.5 rounded-full bg-base-content/10"></div>
                      <div className="w-2/3 h-1.5 rounded-full bg-base-content/10"></div>
                    </div>
                  </div>
                </div>

                <span className={`text-sm font-black tracking-wider uppercase
                  ${theme === t ? "text-primary" : "text-base-content/50 group-hover:text-base-content"}
                `}>
                  {t}
                </span>
                
                <div className="absolute inset-0 rounded-[2.5rem] bg-primary/0 group-hover:bg-primary/5 transition-colors -z-10" />
              </button>
            ))}
          </div>
        </main>
      

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(var(--bc), 0.1); 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  )
}

export default Settings
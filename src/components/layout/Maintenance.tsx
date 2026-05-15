import { motion } from 'motion/react';
import { Hammer } from 'lucide-react';

interface MaintenanceProps {
  message?: string;
}

export default function Maintenance({ message }: MaintenanceProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Ocean Waves Backdrop */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[200%] h-1/2 bg-blue-900/20 blur-[100px]" 
        />
        <div className="absolute bottom-[-100px] left-0 w-full h-[500px]">
           <div className="wave opacity-20" style={{ animationDuration: '7s' }} />
           <div className="wave opacity-10" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
        </div>
      </div>

      {/* Lightning Effect */}
      <motion.div
        animate={{ opacity: [0, 0, 0.4, 0, 0, 0.8, 0] }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.1, 0.12, 0.14, 0.4, 0.42, 0.45] }}
        className="absolute inset-0 bg-white pointer-events-none z-10"
      />

      <div className="relative z-20 text-center px-6">
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative inline-block mb-12"
        >
          {/* Floating Logo / Ship Wreck feel */}
          <div className="w-40 h-40 bg-zinc-900 rounded-3xl rgb-border flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5">
             <span className="text-6xl font-display font-black text-brand-primary">V</span>
          </div>
          {/* Floating detail */}
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl">
             <Hammer className="w-6 h-6" />
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-display font-bold text-white uppercase italic tracking-tighter mb-4">
          SYSTEM CALIBRATION
        </h1>
        
        <div className="max-w-xl mx-auto space-y-6">
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] leading-relaxed">
            The platform is undergoing critical maintenance under maritime conditions. 
            Estimated restoration logic: <span className="text-brand-primary animate-pulse">PENDING OWNER SIGNAL</span>
          </p>
          
          {message && (
            <div className="px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-white italic">
              "{message}"
            </div>
          )}

          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-transparent border border-brand-primary text-brand-primary rounded-xl font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
          >
            Reconnect Terminal
          </button>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-20, 1000],
              x: [Math.random() * 100, Math.random() * -100]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
            style={{ 
              left: `${Math.random() * 100}%`,
              width: '1px',
              height: '30px',
              backgroundColor: 'white'
            }}
            className="absolute top-[-50px]"
          />
        ))}
      </div>
    </div>
  );
}

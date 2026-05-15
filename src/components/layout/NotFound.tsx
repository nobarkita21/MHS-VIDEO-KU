import { motion } from 'motion/react';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="text-brand-primary mb-8"
      >
        <Compass className="w-32 h-32" />
      </motion.div>
      
      <h1 className="text-6xl font-display font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-4">
        Protocol 404
      </h1>
      
      <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-8 text-center max-w-md">
        The requested coordinate is outside the mapped territory of X-Gallery 2026. Terminal redirected.
      </p>

      <button 
        onClick={() => window.location.href = '/'}
        className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
      >
        Return to Origin
      </button>

      <div className="mt-20 flex gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-1 h-1 bg-zinc-800 rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

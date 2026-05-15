import { motion } from 'motion/react';

export default function Splash() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-x-0 top-0 h-64 bg-brand-primary opacity-20 blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "backOut" }}
        className="relative"
      >
        <div className="w-32 h-32 bg-white rounded-3xl rgb-border flex items-center justify-center shadow-2xl shadow-brand-primary/20">
          <span className="text-5xl font-display font-black text-brand-primary italic">V</span>
        </div>
        
        {/* Particle effects */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-40px] border border-dashed border-white/10 rounded-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h1 className="text-3xl font-display font-bold text-white tracking-widest uppercase">
          Video Gallery <span className="text-brand-primary underline decoration-2 underline-offset-8">2026</span>
        </h1>
        <p className="mt-2 text-zinc-500 font-mono text-sm uppercase tracking-widest">Premium Visual Experience</p>
      </motion.div>

      <div className="absolute bottom-12 w-48 h-[1px] bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-brand-primary shadow-[0_0_10px_#FF6321]"
        />
      </div>
    </div>
  );
}

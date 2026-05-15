import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

export default function Banned() {
  return (
    <div className="fixed inset-0 z-[200] bg-red-950 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Animated Red Background */}
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="absolute inset-0 bg-red-600 pointer-events-none"
      />
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="relative z-10 text-center"
      >
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,0,0,0.5)]">
          <ShieldAlert className="w-20 h-20 text-red-600" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-black text-white italic uppercase tracking-tighter mb-4">
          ACCESS TERMINATED
        </h1>
        
        <div className="bg-black/50 backdrop-blur-xl border border-red-500/30 p-8 rounded-3xl max-w-2xl">
          <p className="text-red-400 font-mono text-xl mb-4 uppercase tracking-widest leading-tight">
            Anda dilarang untuk mengakses web ini mending anda tidur daripada merusuh web ini
          </p>
          <div className="w-20 h-1 bg-red-600 mx-auto animate-pulse" />
        </div>
      </motion.div>

      {/* Warning Text Marquee */}
      <div className="absolute bottom-10 w-full overflow-hidden whitespace-nowrap opacity-20">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="text-[120px] font-black text-white uppercase italic"
        >
          RESTRICTED ACCESS • NO ENTRY • SYSTEM PROTECTION ACTIVE • BAN ACTIVE • ABIBDEP ADMIN
        </motion.div>
      </div>
    </div>
  );
}

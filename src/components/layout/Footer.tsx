import { motion } from 'motion/react';

interface FooterProps {
  config: any;
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="relative bg-[#0D0D0D] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Animated Wave Background */}
      <div className="absolute top-0 left-0 w-full h-[120px] overflow-hidden pointer-events-none opacity-20">
        <div className="wave-container scale-y-[-1]">
          <div className="wave" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                <span className="text-white font-display font-black text-3xl">V</span>
              </div>
              <h2 className="text-white font-display font-black text-4xl tracking-tighter uppercase italic">
                {config?.siteName || 'X-GALLERY'}
              </h2>
            </div>
            <p className="text-gray-500 max-w-md leading-relaxed font-medium text-sm">
              The next generation content repository. High-fidelity glass-morphism 
              integrated with lightning-fast delivery protocols and quantum-grade 
              encryption.
            </p>
          </div>

          <div>
            <h3 className="text-zinc-400 font-black mb-8 uppercase tracking-[0.2em] text-[10px]">Infrastructure</h3>
            <ul className="space-y-4 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Neural</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Service Protocols</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">DMCA Filtering</a></li>
              <li><a href="/sitemap.xml" className="hover:text-blue-500 transition-colors">Network Map</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-zinc-400 font-black mb-8 uppercase tracking-[0.2em] text-[10px]">Comm Link</h3>
            <ul className="space-y-4 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Tech Support</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Kernel API</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Satellite Transmission</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Telegram Node</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em]">
            © 2026 {config?.siteName || 'X-GALLERY'}. SYSTEM VERSION 4.0.4-GLASS
          </p>
          <div className="flex items-center gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0D0D0D] ring-1 ring-white/10" 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 100}`} 
                  alt="User"
                />
              ))}
            </div>
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Join 12k+ active nodes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

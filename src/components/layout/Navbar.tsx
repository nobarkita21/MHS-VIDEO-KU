import { useState } from 'react';
import { Sun, Moon, Search, LayoutDashboard, LogIn, User as UserIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import AuthModal from './AuthModal';

interface NavbarProps {
  profile: any;
  onNavigate: (page: any) => void;
  current: string;
}

export default function Navbar({ profile, onNavigate, current }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 glass-surface px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <span className="text-white font-display font-black text-xl">V</span>
            </div>
            <h1 className="hidden md:block text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase">
              X-Gallery <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded ml-1 uppercase tracking-widest font-black">Pro</span>
            </h1>
          </div>

          {/* Search Bar - Frosted with Neon Shadow */}
          <div className="flex-grow max-w-xl hidden md:block">
            <div className="relative group">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full blur-[4px] opacity-30 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-black rounded-full">
                <Search className="absolute left-4 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search amazing content..." 
                  className="w-full pl-12 pr-4 py-2.5 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {profile ? (
              <div className="flex items-center gap-4">
                {['owner', 'admin', 'volunteer', 'relawan'].includes(profile.role) && (
                  <button 
                    onClick={() => onNavigate('admin')}
                    className={`p-2.5 rounded-full transition-all ${current === 'admin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </button>
                )}
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-500/50 p-0.5 cursor-pointer hover:border-blue-500 transition-colors">
                    <img 
                      src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} 
                      className="w-full h-full rounded-full object-cover bg-zinc-800"
                      alt="Profile"
                    />
                  </div>
                  <div className="absolute right-0 mt-3 w-56 hidden group-hover:block glass-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-5 border-b border-white/5">
                      <p className="text-white font-bold text-sm truncate">{profile.displayName}</p>
                      <p className="text-zinc-500 text-[10px] truncate uppercase font-mono mt-1">{profile.email || profile.phoneNumber}</p>
                      <span className="inline-block mt-3 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[9px] rounded uppercase font-black tracking-widest border border-blue-500/20">
                        {profile.role}
                      </span>
                    </div>
                    <button 
                      onClick={() => signOut(auth)}
                      className="w-full text-left px-5 py-3.5 text-red-500 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Terminate Access
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all shadow-lg shadow-blue-600/30 active:scale-95"
              >
                Access Terminal
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

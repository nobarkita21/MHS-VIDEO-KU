/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Splash from './components/layout/Splash';
import Home from './components/gallery/Home';
import AdminDashboard from './components/admin/AdminDashboard';
import PostDetail from './components/gallery/PostDetail';
import Maintenance from './components/layout/Maintenance';
import Banned from './components/layout/Banned';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'detail' | 'none'>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    // Global Config
    const unsubConfig = onSnapshot(doc(db, 'settings', 'config'), (doc) => {
      setConfig(doc.data());
    });

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const pDoc = await getDoc(doc(db, 'users', u.uid));
        const pData = pDoc.data();
        
        // Auto-assign owner/admin if matching the special email
        const isAdminEmail = u.email === 'abibdep@gmail.com';
        const finalProfile = {
          ...pData,
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || u.phoneNumber || 'User',
          photoURL: u.photoURL,
          role: isAdminEmail ? 'owner' : (pData?.role || 'user')
        };
        setProfile(finalProfile);
      } else {
        setProfile(null);
      }
      
      // Artificial delay for Splash
      setTimeout(() => setLoading(false), 2500);
    });

    return () => {
      unsubAuth();
      unsubConfig();
    };
  }, []);

  if (loading) return <Splash />;
  if (config?.maintenanceMode && profile?.role !== 'owner') return <Maintenance message={config.maintenanceMessage} />;
  if (profile?.isBanned) return <Banned />;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-[#050505] selection:bg-blue-600/30 selection:text-white">
        {/* Animated Background Elements */}
        <div className="neon-glow-blue top-[-10%] left-[-10%]" />
        <div className="neon-glow-purple bottom-[-10%] right-[-10%]" />

        <Navbar 
          profile={profile} 
          onNavigate={(page) => setCurrentPage(page)} 
          current={currentPage}
        />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {currentPage === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Home onSelect={(id) => {
                  setSelectedPostId(id);
                  setCurrentPage('detail');
                }} />
              </motion.div>
            )}
            
            {currentPage === 'detail' && selectedPostId && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <PostDetail postId={selectedPostId} onBack={() => setCurrentPage('home')} />
              </motion.div>
            )}

            {currentPage === 'admin' && profile && ['owner', 'admin', 'volunteer'].includes(profile.role) && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <AdminDashboard profile={profile} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer config={config} />
      </div>
    </ThemeProvider>
  );
}

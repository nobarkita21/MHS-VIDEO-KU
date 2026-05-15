import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Users, Settings, Activity, 
  BarChart3, Upload, Trash2, Edit3, ShieldAlert,
  CheckCircle, Hammer, Info, Search, PlusCircle, X,
  Eye, Heart
} from 'lucide-react';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

interface AdminProps {
  profile: any;
}

export default function AdminDashboard({ profile }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'users' | 'settings'>('overview');
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const unsubPosts = onSnapshot(collection(db, 'posts'), (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubPosts();
      unsubUsers();
      unsubCats();
    };
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('media') as File;
    const title = formData.get('title') as string;
    const catId = formData.get('category') as string;
    const badge = formData.get('badge') as string;

    if (!file || !title) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const fileData = reader.result as string;
        setUploadProgress(40);

        const response = await axios.post('/api/upload', {
          fileData,
          fileName: file.name,
          isVideo: file.type.startsWith('video/'),
        });

        if (response.data.success) {
          setUploadProgress(80);
          await addDoc(collection(db, 'posts'), {
            title,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            mediaUrl: response.data.directUrl,
            telegramFileId: response.data.fileId,
            categoryId: catId,
            userId: profile.uid,
            views: 0,
            likesCount: 0,
            commentsCount: 0,
            status: 'published',
            badge,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            setShowAddModal(false);
          }, 500);
        }
      };
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const statData = [
    { name: 'Mon', views: 4000, likes: 2400 },
    { name: 'Tue', views: 3000, likes: 1398 },
    { name: 'Wed', views: 2000, likes: 9800 },
    { name: 'Thu', views: 2780, likes: 3908 },
    { name: 'Fri', views: 1890, likes: 4800 },
    { name: 'Sat', views: 2390, likes: 3800 },
    { name: 'Sun', views: 3490, likes: 4300 },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-zinc-950 font-mono text-xs overflow-hidden">
      {/* Sidebar Sidebar - Technical Style */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col gap-8 bg-zinc-950">
        <div className="space-y-4">
          <p className="text-zinc-600 uppercase tracking-tighter italic">Terminal Access</p>
          <div className="flex flex-col gap-2">
            {[
              { id: 'overview', icon: BarChart3, label: 'Overview' },
              { id: 'gallery', icon: LayoutGrid, label: 'Gallery' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-primary text-white shadow-lg' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-bold uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-8 border-t border-zinc-800">
           <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
             <p className="text-zinc-500 mb-1">System Load</p>
             <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
               <motion.div animate={{ width: ['20%', '45%', '30%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-brand-primary" />
             </div>
           </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow overflow-y-auto p-4 md:p-10 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase mb-2">Command Center</h1>
                  <p className="text-zinc-500">Real-time infrastructure monitoring and delivery stats.</p>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>Systems Operational</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Views', value: posts.reduce((a, b) => a + (b.views || 0), 0), trend: '+12%' },
                  { label: 'Cloud Storage', value: `${posts.length} Obs`, trend: 'Active' },
                  { label: 'Users', value: users.length, trend: '+4%' },
                  { label: 'Bandwidth', value: '3.4 GB/s', trend: 'Peak' }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-white/5 group hover:border-brand-primary/30 transition-colors">
                    <p className="text-zinc-500 uppercase font-black tracking-widest text-[10px] mb-2">{stat.label}</p>
                    <div className="flex items-end justify-between leading-none">
                      <span className="text-3xl font-display font-bold text-white">{stat.value}</span>
                      <span className="pb-1 text-brand-primary font-bold">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 h-[400px]">
                  <h3 className="text-white font-bold mb-8 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-primary" /> Traffic Analytics
                  </h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={statData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6321" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF6321" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="views" stroke="#FF6321" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 h-[400px]">
                  <h3 className="text-white font-bold mb-8 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" /> Interaction Metrics
                  </h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={statData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={10} />
                      <Bar dataKey="likes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
             <motion.div key="gallery" className="space-y-8">
               <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase">Gallery Management</h2>
                 <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
                 >
                   <PlusCircle className="w-5 h-5" /> Add Post
                 </button>
               </div>

               <div className="overflow-x-auto rounded-2xl border border-white/5 bg-zinc-900/30">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-zinc-900 text-zinc-500 uppercase text-[10px] tracking-widest font-black">
                       <th className="p-6">Content</th>
                       <th className="p-6">Type/Category</th>
                       <th className="p-6">Activity</th>
                       <th className="p-6">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {posts.map((post) => (
                       <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                         <td className="p-6">
                           <div className="flex items-center gap-4">
                             <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 ring-1 ring-white/10">
                               <img src={post.thumbnailUrl || post.mediaUrl} className="w-full h-full object-cover" />
                             </div>
                             <div>
                               <p className="text-white font-bold text-sm mb-1">{post.title}</p>
                               <span className="px-2 py-0.5 bg-zinc-800 rounded text-[9px] text-zinc-500 uppercase font-mono">{post.id}</span>
                             </div>
                           </div>
                         </td>
                         <td className="p-6">
                           <div className="flex flex-col gap-1">
                             <span className="text-blue-400 font-bold uppercase">{post.type}</span>
                             <span className="text-zinc-600 font-mono italic">{post.categoryId}</span>
                           </div>
                         </td>
                         <td className="p-6">
                           <div className="flex items-center gap-6 text-zinc-400 font-bold">
                             <div className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views}</div>
                             <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-red-500/50" /> {post.likesCount}</div>
                           </div>
                         </td>
                         <td className="p-6">
                           <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2.5 bg-white/5 hover:bg-brand-primary text-zinc-400 hover:text-white rounded-xl transition-all">
                               <Edit3 className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => deleteDoc(doc(db, 'posts', post.id))}
                               className="p-2.5 bg-white/5 hover:bg-red-500 text-zinc-400 hover:text-white rounded-xl transition-all"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" className="space-y-8">
               <h2 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase">Protocol Controls: Users</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {users.map(u => (
                   <div key={u.id} className="p-6 rounded-3xl bg-zinc-900 border border-white/5 relative group overflow-hidden">
                     <div className={`absolute top-0 left-0 w-1 h-full ${u.isBanned ? 'bg-red-500' : 'bg-brand-primary'}`} />
                     <div className="flex items-center gap-4 mb-6">
                       <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`} className="w-14 h-14 rounded-2xl ring-2 ring-white/5" />
                       <div>
                         <p className="text-white font-bold text-lg">{u.displayName}</p>
                         <p className="text-zinc-500 text-[10px] font-mono break-all">{u.uid}</p>
                       </div>
                     </div>
                     <div className="flex flex-wrap gap-2 mb-6">
                       <span className="px-3 py-1 bg-zinc-800 rounded-lg text-[10px] text-zinc-300 font-bold uppercase tracking-widest">{u.role}</span>
                       {u.isVerified && <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>}
                       {u.isBanned && <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Banned</span>}
                     </div>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => updateDoc(doc(db, 'users', u.id), { isBanned: !u.isBanned })}
                          className={`flex-grow py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                            u.isBanned ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-red-500/20 text-red-500 border border-red-500/20'
                          }`}
                        >
                          {u.isBanned ? 'Lift Ban' : 'Restrict Access'}
                        </button>
                        <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10">
                          <Edit3 className="w-4 h-4" />
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" className="space-y-10 max-w-2xl">
               <h2 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase">Platform Calibration</h2>
               
               <div className="space-y-8">
                 <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                   <h3 className="text-white font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                     <Hammer className="w-4 h-4 text-orange-500" /> Maintenance Protocol
                   </h3>
                   <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-white/5">
                     <div>
                       <p className="text-white font-bold">Maintenance Mode</p>
                       <p className="text-zinc-500 text-xs">Offline status for all non-owner agents.</p>
                     </div>
                     <div className="w-14 h-8 bg-zinc-800 rounded-full p-1 cursor-pointer">
                        <div className="w-6 h-6 bg-zinc-600 rounded-full" />
                     </div>
                   </div>
                 </div>

                 <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                   <h3 className="text-white font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                     <CheckCircle className="w-4 h-4 text-brand-primary" /> Monetization
                   </h3>
                   <textarea 
                     placeholder="paste your ads.txt content here..."
                     className="w-full h-32 bg-black/50 border border-white/5 rounded-2xl p-4 text-zinc-400 font-mono text-xs focus:ring-1 focus:ring-brand-primary outline-none"
                   />
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Post Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-8 relative shadow-2xl"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter mb-8">Deploy New Asset</h3>
              
              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black mb-2 block">Post Title</label>
                  <input name="title" required className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-primary outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase font-black mb-2 block">Category</label>
                    <select name="category" className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-primary outline-none">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase font-black mb-2 block">Badge</label>
                    <select name="badge" className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-primary outline-none">
                      <option value="none">None</option>
                      <option value="new">New</option>
                      <option value="viral">Viral</option>
                      <option value="trending">Trending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black mb-2 block">Media Content (Max 40MB)</label>
                  <div className="relative group">
                    <input name="media" type="file" required className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center group-hover:border-brand-primary/50 transition-colors bg-white/5">
                      <Upload className="w-10 h-10 text-zinc-600 mb-4" />
                      <p className="text-zinc-400 font-bold">DRAG & DROP MEDIA</p>
                      <p className="text-zinc-600 text-[9px] mt-1 uppercase tracking-widest font-mono">Accepts MP4, JPEG, PNG</p>
                    </div>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-brand-primary uppercase">
                      <span>Uploading Protocol...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} className="h-full bg-brand-primary shadow-[0_0_10px_#FF6321]" />
                    </div>
                  </div>
                )}

                <button 
                  disabled={isUploading}
                  className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Confirm Deployment
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

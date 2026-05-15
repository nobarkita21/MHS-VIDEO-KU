import { motion } from 'motion/react';
import { 
  ArrowLeft, Eye, Heart, MessageCircle, Share2, 
  Download, Clock, Tag, ExternalLink, Maximize2 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { doc, onSnapshot, updateDoc, increment, getDoc } from 'firebase/firestore';

interface PostDetailProps {
  postId: string;
  onBack: () => void;
}

export default function PostDetail({ postId, onBack }: PostDetailProps) {
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Increment view
    const incrementViews = async () => {
      const docRef = doc(db, 'posts', postId);
      await updateDoc(docRef, { views: increment(1) });
    };
    incrementViews();

    const unsub = onSnapshot(doc(db, 'posts', postId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPost(data);
        
        // Fetch author
        getDoc(doc(db, 'users', data.userId)).then(aDoc => setAuthor(aDoc.data()));
      }
    });

    return () => unsub();
  }, [postId]);

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `Check out this ${post.type} on X-Gallery!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing', err);
    }
  };

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#050505] pt-12 px-4 pb-24 relative overflow-hidden">
      {/* Background Neon Elements */}
      <div className="neon-glow-blue top-[10%] left-[-20%] pointer-events-none" />
      <div className="neon-glow-purple bottom-[10%] right-[-20%] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-zinc-500 hover:text-white mb-10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
          <span className="font-black uppercase text-[10px] tracking-[0.3em]">Return to Origin</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-10">
            {/* Immersive Media Surface */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative aspect-video rounded-[32px] overflow-hidden bg-black shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 group group/video"
            >
              {post.type === 'video' ? (
                <video 
                  src={post.mediaUrl} 
                  controls 
                  className="w-full h-full object-contain"
                  poster={post.thumbnailUrl}
                />
              ) : (
                <img 
                  src={post.mediaUrl} 
                  alt={post.title} 
                  className="w-full h-full object-contain"
                />
              )}
              
              <div className="absolute top-6 right-6 z-10 opacity-0 group-hover/video:opacity-100 transition-all scale-75 group-hover/video:scale-100">
                <button className="p-4 glass-surface rounded-2xl text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                  <Maximize2 className="w-6 h-6" />
                </button>
              </div>
            </motion.div>

            {/* Interaction Layer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-surface p-8 rounded-[32px] flex items-center justify-between">
                <div className="flex gap-10">
                  <div className="flex flex-col">
                    <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mb-2">Metrics</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-2xl font-display font-black text-white italic">{post.views?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mb-2">Protocol</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="text-xl font-mono font-black text-gray-300">2026.V2</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-5 rounded-2xl border transition-all ${
                      isLiked 
                      ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                      : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="glass-surface p-8 rounded-[32px] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mb-2">Infrastructure</span>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-9 h-9 rounded-full border-2 border-zinc-900 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + post.userId}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">+12k Cluster</span>
                  </div>
                </div>
                <button 
                  onClick={handleShare}
                  className="px-8 py-4 glass-surface rounded-2xl text-blue-400 font-black uppercase text-[10px] tracking-widest hover:bg-blue-600/10 transition-all border-blue-500/30"
                >
                  Broadcast
                </button>
              </div>
            </div>

            {/* Description Surface */}
            <div className="p-10 glass-surface rounded-[40px] border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-5 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  {post.categoryId}
                </span>
                <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  {post.type}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-8 leading-tight uppercase italic tracking-tighter">
                {post.title}
              </h1>
              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-3xl">
                Integrated through X-Gallery neural transmission. This content remains 
                persistent within the regional cloud clusters. High-fidelity rendering 
                optimized for 2026 sensory standards.
              </p>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-10">
            {/* Creator Glass Profile */}
            <div className="p-8 glass-surface rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
              
              <div className="flex items-center gap-5 mb-10 border-b border-white/5 pb-8">
                <div className="w-16 h-16 rounded-2xl border-2 border-blue-500/30 p-1 group-hover:border-blue-500 transition-colors">
                  <img 
                    src={author?.photoURL || `https://ui-avatars.com/api/?name=${author?.displayName}`} 
                    className="w-full h-full rounded-xl object-cover bg-zinc-800"
                  />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-sm tracking-tight flex items-center gap-2">
                    {author?.displayName || 'OPERATOR'}
                    {author?.isVerified && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30"><svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>}
                  </h3>
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic underline decoration-blue-500/30">
                    {author?.role || 'CONTRIBUTOR'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full relative group/btn overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover/btn:scale-110 transition-transform duration-500"></div>
                  <div className="relative w-full flex items-center justify-center gap-4 py-5 font-black uppercase text-[10px] tracking-[0.3em] text-white shadow-2xl">
                    <Download className="w-5 h-5" />
                    Download Protocol
                  </div>
                </button>
                <div className="flex justify-center">
                  <span className="text-[10px] text-zinc-700 font-mono font-black uppercase tracking-widest">Payload: {post.size || '42.2 MB'}</span>
                </div>
              </div>
            </div>

            {/* Neural Recommendations */}
            <div className="space-y-6">
              <h4 className="text-white font-display font-black uppercase tracking-widest italic text-sm pl-4 border-l-2 border-purple-500">Neural Sync</h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 p-3 rounded-2xl glass-surface border-white/5 hover:bg-white/5 transition-all cursor-pointer group/item">
                    <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-black/40 border border-white/5 relative">
                      <div className="absolute inset-0 bg-blue-600/10 group-hover/item:opacity-30 transition-opacity" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="h-3 w-32 bg-white/5 rounded mb-2 group-hover/item:bg-blue-600/20 transition-colors" />
                      <div className="h-2 w-20 bg-black/40 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'motion/react';
import { Eye, Heart, MessageCircle, Share2, Play } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface VideoCardProps {
  post: any;
  onClick: () => void;
  key?: any;
}

const formatNumber = (num: number) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'M';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'jt';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'rb';
  return num.toString();
};

export default function VideoCard({ post, onClick }: VideoCardProps) {
  const [author, setAuthor] = useState<any>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      const docRef = doc(db, 'users', post.userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAuthor(docSnap.data());
      }
    };
    fetchAuthor();
  }, [post.userId]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
      
      {/* High-End Glass Card */}
      <div className="relative glass-card rounded-2xl overflow-hidden z-10 transition-all duration-500">
        
        {/* Badge Overlay - Neon Pulse */}
        {post.badge && post.badge !== 'none' && (
          <div className="absolute top-3 left-3 z-20">
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 ${
                post.badge === 'viral' ? 'bg-red-600 text-white' :
                post.badge === 'trending' ? 'bg-blue-600 text-white' :
                'bg-purple-600 text-white'
              }`}
            >
              <div className="w-1 h-1 bg-white rounded-full animate-ping" />
              {post.badge}
            </motion.div>
          </div>
        )}

        {/* Thumbnail - cinematic scale */}
        <div className="aspect-[4/5] relative overflow-hidden group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-blue-600/10 transition-all">
          <img 
            src={post.thumbnailUrl || post.mediaUrl} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
          
          {post.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Views - Minimalist Mono */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
            <span className="w-1 h-1 bg-blue-500 rounded-full" />
            {formatNumber(post.views || 0)} ANALYTICS
          </div>
        </div>

        {/* Content Info - Polished Typography */}
        <div className="p-5 bg-black/40 backdrop-blur-md">
          <h3 className="text-white font-bold leading-tight line-clamp-2 mb-4 group-hover:text-blue-400 transition-colors text-sm uppercase tracking-tight">
            {post.title}
          </h3>
          
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm border border-white/10 p-0.5 group-hover:border-blue-500/50 transition-colors">
                <img 
                  src={author?.photoURL || `https://ui-avatars.com/api/?name=${author?.displayName || 'U'}`} 
                  className="w-full h-full rounded-sm object-cover"
                  alt="User"
                />
              </div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest truncate max-w-[70px]">
                {author?.displayName || 'OPERATOR'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3 h-3 group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
                <span className="text-[9px] font-black tracking-widest">{formatNumber(post.likesCount || 0)}</span>
              </div>
              <MessageCircle className="w-3 h-3 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Glow */}
      <div className="absolute -inset-2 bg-blue-600/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-full" />
    </motion.div>
  );
}

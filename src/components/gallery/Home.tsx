import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import VideoCard from './VideoCard';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Star, Zap, Clock } from 'lucide-react';

interface HomeProps {
  onSelect: (id: string) => void;
}

export default function Home({ onSelect }: HomeProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const unsubPosts = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubPosts();
      unsubCats();
    };
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.categoryId === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Categories Horizontal Scroll - Frosted Glass */}
      <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-8 py-3 rounded-full text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap border ${
            activeCategory === 'all' 
              ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20 scale-105' 
              : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10'
          }`}
        >
          Central Terminal
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-8 py-3 rounded-full text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap border ${
              activeCategory === cat.id 
                ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/20 scale-105' 
                : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Featured Header - Minimalist Precision */}
      <div className="flex items-center justify-between mb-8 border-l-2 border-blue-600 pl-6">
        <div className="flex flex-col">
          <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-white">Trending Feed</h2>
          <p className="text-[10px] text-blue-500 font-mono uppercase tracking-[0.2em] mt-1">Real-time engagement optimization</p>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <AnimatePresence>
          {filteredPosts.map((post) => (
            <VideoCard 
              key={post.id} 
              post={post} 
              onClick={() => onSelect(post.id)} 
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-zinc-800/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No results found</h3>
          <p className="text-zinc-500">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}

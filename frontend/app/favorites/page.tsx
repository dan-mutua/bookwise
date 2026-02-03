'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { BookmarkCard } from '@/components/BookmarkCard';
import { Button } from '@/components/Button';
import { MobileHeader } from '@/components/MobileHeader';
import { MobileNav } from '@/components/MobileNav';
import { AddBookmarkModal } from '@/components/AddBookmarkModal';

const mockBookmarks = [
  {
    id: '1',
    url: 'https://github.com/nestjs/nest',
    title: 'NestJS - A progressive Node.js framework',
    description: 'A progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
    favicon: '',
    isFavorite: true,
    mlCategory: 'technology',
    mlConfidence: 0.92,
    tags: [
      { id: 't1', name: 'technology', color: '#0077b6' },
      { id: 't2', name: 'backend', color: '#2a9d8f' },
      { id: 't3', name: 'nodejs', color: '#06a77d' },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    url: 'https://www.amazon.com/dp/B08N5WRWNW',
    title: 'Mechanical Keyboard - Cherry MX Blue',
    description: 'Premium mechanical keyboard with Cherry MX Blue switches for the ultimate typing experience.',
    favicon: '',
    isFavorite: true,
    mlCategory: 'shopping',
    mlConfidence: 0.95,
    tags: [
      { id: 't8', name: 'shopping', color: '#d00000' },
      { id: 't9', name: 'tech', color: '#0077b6' },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    url: 'https://www.coursera.org/learn/machine-learning',
    title: 'Machine Learning - Stanford Online',
    description: 'Learn about the most effective machine learning techniques from Andrew Ng.',
    favicon: '',
    isFavorite: true,
    mlCategory: 'education',
    mlConfidence: 0.89,
    tags: [
      { id: 't12', name: 'education', color: '#2a9d8f' },
      { id: 't13', name: 'ml', color: '#0077b6' },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockCategories = [
  { id: 'technology', name: 'technology', count: 24, color: '#0077b6' },
  { id: 'news', name: 'news', count: 8, color: '#fb8500' },
  { id: 'social', name: 'social', count: 12, color: '#06a77d' },
  { id: 'entertainment', name: 'entertainment', count: 15, color: '#b5179e' },
  { id: 'shopping', name: 'shopping', count: 6, color: '#d00000' },
  { id: 'education', name: 'education', count: 11, color: '#2a9d8f' },
  { id: 'reference', name: 'reference', count: 9, color: '#6c757d' },
];

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(mockBookmarks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = !searchQuery || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleFavoriteToggle = (id: string) => {
    setBookmarks(prev =>
      prev.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)
    );
  };

  const handleDelete = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleAddBookmark = async (data: { url: string; title: string; description?: string }) => {
    const newBookmark = {
      id: String(Date.now()),
      url: data.url,
      title: data.title,
      description: data.description || '',
      favicon: '',
      isFavorite: true,
      mlCategory: 'uncategorized',
      mlConfidence: 0,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <div className="hidden md:block">
        <Sidebar 
          categories={mockCategories} 
          activeCategory=""
          onCategoryChange={() => {}}
        />
      </div>

      <MobileHeader
        title="Favorites"
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="gradient-mesh min-h-full">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 md:mb-8 hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-text-primary/10 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-1">
                    ⭐ Favorites
                  </h1>
                  <p className="text-xs md:text-sm text-text-secondary font-mono">
                    {bookmarks.length} favorite bookmarks
                  </p>
                </div>
                <Button variant="accent" icon="+" size="md" onClick={() => setIsAddModalOpen(true)} className="glow-effect shadow-lg">
                  Add Bookmark
                </Button>
              </div>
            </motion.div>

            {/* Search */}
            <div className="mb-6 md:mb-8 w-full md:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search favorites..."
              />
            </div>

            {/* Bookmark Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBookmarks.map((bookmark, index) => (
                <BookmarkCard
                  key={bookmark.id}
                  {...bookmark}
                  onFavoriteToggle={handleFavoriteToggle}
                  onDelete={handleDelete}
                  delay={index * 0.05}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredBookmarks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="font-display font-semibold text-xl text-text-primary mb-2">
                  No favorites yet
                </h3>
                <p className="text-text-secondary">
                  Star bookmarks to save them as favorites
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <MobileNav />

      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBookmark}
      />
    </div>
  );
}

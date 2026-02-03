'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { MobileHeader } from '@/components/MobileHeader';
import { MobileNav } from '@/components/MobileNav';
import { AddBookmarkModal } from '@/components/AddBookmarkModal';
import { BookmarksList } from '@/components/BookmarksList';

const mockBookmarks = [
  {
    id: '3',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Amazing Tutorial - Learn React in 10 Minutes',
    description: 'The best React tutorial you will ever watch.',
    favicon: '',
    isFavorite: false,
    mlCategory: 'entertainment',
    mlConfidence: 0.75,
    tags: [
      { id: 't6', name: 'video', color: '#b5179e' },
      { id: 't7', name: 'tutorial', color: '#2a9d8f' },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    url: 'https://www.nytimes.com',
    title: 'The New York Times - Breaking News',
    description: 'Live news, investigations, opinion, photos and video by journalists from around the world.',
    favicon: '',
    isFavorite: false,
    mlCategory: 'news',
    mlConfidence: 0.88,
    tags: [
      { id: 't4', name: 'news', color: '#fb8500' },
      { id: 't5', name: 'media', color: '#d00000' },
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
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
];

const mockCategories = [
  { id: 'technology', name: 'Technology', count: 24, color: '#0077b6' },
  { id: 'news', name: 'News', count: 8, color: '#fb8500' },
  { id: 'social', name: 'Social', count: 12, color: '#06a77d' },
  { id: 'entertainment', name: 'Entertainment', count: 15, color: '#b5179e' },
  { id: 'shopping', name: 'Shopping', count: 6, color: '#d00000' },
  { id: 'education', name: 'Education', count: 11, color: '#2a9d8f' },
  { id: 'reference', name: 'Reference', count: 9, color: '#6c757d' },
];

export default function RecentPage() {
  const [bookmarks, setBookmarks] = useState(mockBookmarks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavoriteToggle = (id: string) => {
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
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
      isFavorite: false,
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
          onCategoryChange={() => {}}
        />
      </div>

      <MobileHeader
        title="Recent"
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="gradient-mesh min-h-full">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Search */}
            <div className="mb-6 md:mb-8 w-full md:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search recent bookmarks..."
              />
            </div>

            <BookmarksList
              bookmarks={filteredBookmarks}
              onFavoriteToggle={handleFavoriteToggle}
              onDelete={handleDelete}
              title="🕒 Recent Bookmarks"
              subtitle={`${filteredBookmarks.length} recently added bookmarks`}
              onAddClick={() => setIsAddModalOpen(true)}
              emptyStateIcon="🕒"
              emptyStateTitle="No recent bookmarks"
              emptyStateMessage="Your recently added bookmarks will appear here"
            />
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

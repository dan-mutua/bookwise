'use client';

import { motion } from 'framer-motion';
import { BookmarkCard } from './BookmarkCard';
import { Button } from './Button';

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  isFavorite: boolean;
  mlCategory?: string;
  mlConfidence?: number;
  tags: Array<{ id: string; name: string; color: string }>;
  createdAt: string;
}

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onFavoriteToggle: (id: string) => void;
  onDelete: (id: string) => void;
  title: string;
  subtitle?: string;
  onAddClick: () => void;
  emptyStateIcon?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

export function BookmarksList({
  bookmarks,
  onFavoriteToggle,
  onDelete,
  title,
  subtitle,
  onAddClick,
  emptyStateIcon = '📭',
  emptyStateTitle = 'No bookmarks found',
  emptyStateMessage = 'Start adding bookmarks to see them here',
}: BookmarksListProps) {
  const totalCount = bookmarks.length;

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8 hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-text-primary/10 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-text-secondary font-mono">
                {subtitle}
              </p>
            )}
          </div>
          <Button variant="accent" icon="+" size="md" onClick={onAddClick} className="glow-effect shadow-lg">
            Add Bookmark
          </Button>
        </div>
      </motion.div>

      {/* Bookmark Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bookmarks.map((bookmark, index) => (
          <BookmarkCard
            key={bookmark.id}
            {...bookmark}
            onFavoriteToggle={onFavoriteToggle}
            onDelete={onDelete}
            delay={index * 0.05}
          />
        ))}
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">{emptyStateIcon}</div>
          <h3 className="font-display font-semibold text-xl text-text-primary mb-2">
            {emptyStateTitle}
          </h3>
          <p className="text-text-secondary">
            {emptyStateMessage}
          </p>
        </motion.div>
      )}
    </>
  );
}

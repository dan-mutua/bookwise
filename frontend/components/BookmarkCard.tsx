'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';

interface BookmarkCardProps {
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
  onFavoriteToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  delay?: number;
}

export function BookmarkCard({
  id,
  url,
  title,
  description,
  favicon,
  isFavorite,
  mlCategory,
  mlConfidence,
  tags,
  createdAt,
  onFavoriteToggle,
  onDelete,
  delay = 0,
}: BookmarkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const domain = new URL(url).hostname.replace('www.', '');
  const timeAgo = formatTimeAgo(createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className={clsx(
        'relative h-full rounded-2xl bg-surface-elevated p-5',
        'border-2 border-text-primary/10 transition-all duration-200',
        'hover:border-brand-primary hover:shadow-lg',
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Favicon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-surface-muted flex items-center justify-center text-xl">
              {favicon ? (
                <img src={favicon} alt="" className="w-6 h-6" />
              ) : (
                <span>{getEmojiForCategory(mlCategory)}</span>
              )}
            </div>

            {/* Title & Domain */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-[15px] text-text-primary truncate mb-0.5">
                {title}
              </h3>
              <p className="text-xs text-text-muted font-mono">{domain}</p>
            </div>
          </div>

          {/* Favorite Star */}
          <button
            onClick={() => onFavoriteToggle?.(id)}
            className="flex-shrink-0 text-2xl transition-transform hover:scale-110 ml-2"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        {/* ML Badge */}
        {mlCategory && mlConfidence && mlConfidence > 0.7 && (
          <div className="absolute top-5 right-14">
            <div className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 flex items-center gap-1">
              <span className="text-xs">🤖</span>
              <span className="text-[9px] font-mono font-medium text-emerald-700">
                {Math.round(mlConfidence * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-[10px] font-medium"
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-surface-muted text-text-muted">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-text-primary/5">
          <p className="text-[11px] text-text-muted font-mono">{timeAgo}</p>

          {/* Hover actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="flex gap-2"
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-brand-primary hover:text-brand-light transition-colors"
            >
              Visit
            </a>
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="text-xs font-medium text-text-muted hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function getEmojiForCategory(category?: string): string {
  const emojiMap: Record<string, string> = {
    technology: '💻',
    news: '📰',
    social: '👥',
    entertainment: '🎬',
    shopping: '🛒',
    education: '📚',
    reference: '📖',
  };
  return emojiMap[category || ''] || '🔖';
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

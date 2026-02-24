import React from 'react';
import { BookmarkX, Archive } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'archived' | 'filter';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const content = {
    search: {
      icon: BookmarkX,
      title: 'No bookmarks found',
      description: 'Try adjusting your search or filters',
    },
    archived: {
      icon: Archive,
      title: 'No archived bookmarks',
      description: 'Archive bookmarks to see them here',
    },
    filter: {
      icon: BookmarkX,
      title: 'No matching bookmarks',
      description: 'Try selecting different tags',
    },
  };

  const { icon: Icon, title, description } = content[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="size-8 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">{description}</p>
    </div>
  );
};

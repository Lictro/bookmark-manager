import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Pin,
  Archive,
  ArchiveRestore,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';
import { Bookmark } from '../types/bookmark';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { BookmarkDialog } from './BookmarkDialog';
import { useBookmarkData } from '@/context/BookmarkDataContext';
import { formatDate, getFaviconUrl } from '@/utils/bookmarksUtils';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark }) => {
  const { togglePin, toggleArchive, visitBookmark, deleteBookmark } = useBookmarkData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        await navigator.clipboard.writeText(bookmark.url);
        toast.success('URL copied to clipboard');
    } catch (error) {
        toast.error('Failed to copy URL');
    }
  };

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    visitBookmark(bookmark.id);
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(bookmark.id);
    toast.success(bookmark.is_pinned ? 'Unpinned bookmark' : 'Pinned bookmark');
  };

  const handleToggleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleArchive(bookmark.id);
    toast.success(bookmark.is_archived ? 'Restored bookmark' : 'Archived bookmark');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this bookmark?')) {
      deleteBookmark(bookmark.id);
      toast.success('Bookmark deleted');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div
        onClick={() => setIsDetailDialogOpen(true)}
        className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
      >
        {bookmark.is_pinned && (
          <div className="absolute top-2 right-2">
            <Pin className="size-4 fill-blue-600 text-blue-600" />
          </div>
        )}

        <div className="flex gap-4">
          {/* Favicon */}
          <div className="flex-shrink-0">
            <img
              src={getFaviconUrl(bookmark.url)}
              alt=""
              className="size-12 rounded-lg border border-gray-200 dark:border-gray-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"%3E%3C/path%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {bookmark.title}
              </h3>
              
              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleVisit}>
                    <ExternalLink className="size-4 mr-2" />
                    Visit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyUrl}>
                    <Copy className="size-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleTogglePin}>
                    <Pin className="size-4 mr-2" />
                    {bookmark.is_pinned ? 'Unpin' : 'Pin'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Pencil className="size-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleToggleArchive}>
                    {bookmark.is_archived ? (
                      <ArchiveRestore className="size-4 mr-2" />
                    ) : (
                      <Archive className="size-4 mr-2" />
                    )}
                    {bookmark.is_archived ? 'Restore' : 'Archive'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {bookmark.description}
            </p>

            {/* Tags */}
            {bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {bookmark.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {bookmark.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{bookmark.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Meta Info with Quick Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="size-3" />
                  <span>{bookmark.view_count}</span>
                </div>
                <span>•</span>
                <span>Added {formatDate(bookmark.created_at)}</span>
              </div>
              
              {/* Quick Actions (visible on hover) */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="size-7" onClick={handleCopyUrl}>
                  <Copy className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7" onClick={handleVisit}>
                  <ExternalLink className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookmarkDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        bookmark={bookmark}
      />
    </>
  );
};
import React from 'react';
import {
  ExternalLink,
  Copy,
  Pin,
  Archive,
  ArchiveRestore,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';
import { Bookmark } from '../types/bookmark';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import { useBookmarkData } from '@/context/BookmarkDataContext';
import { formatDate, getFaviconUrl } from '@/utils/bookmarksUtils';
import { Separator } from './ui/separator';

interface BookmarkDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookmark: Bookmark;
}

export const BookmarkDetailDialog: React.FC<BookmarkDetailDialogProps> = ({
  open,
  onOpenChange,
  bookmark,
}) => {
  const { togglePin, toggleArchive, visitBookmark } = useBookmarkData();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      toast.success('URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleVisit = () => {
    visitBookmark(bookmark.id);
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleTogglePin = () => {
    togglePin(bookmark.id);
    toast.success(bookmark.is_pinned ? 'Unpinned bookmark' : 'Pinned bookmark');
  };

  const handleToggleArchive = () => {
    toggleArchive(bookmark.id);
    toast.success(bookmark.is_archived ? 'Restored bookmark' : 'Archived bookmark');
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Bookmark Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Favicon and Title */}
          <div className="flex gap-4">
            <img
              src={getFaviconUrl(bookmark.url)}
              alt=""
              className="size-16 rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"%3E%3C/path%3E%3C/svg%3E';
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex-1">
                  {bookmark.title}
                </h2>
                {bookmark.is_pinned && (
                  <Pin className="size-5 fill-blue-600 text-blue-600 flex-shrink-0" />
                )}
              </div>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                onClick={(e) => {
                  e.preventDefault();
                  handleVisit();
                }}
              >
                {bookmark.url}
              </a>
            </div>
          </div>

          {/* Description */}
          {bookmark.description && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {bookmark.description}
                </p>
              </div>
            </>
          )}

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {bookmark.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Stats */}
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <Eye className="size-4" />
                <span className="text-xs">Views</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {bookmark.view_count}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <Clock className="size-4" />
                <span className="text-xs">Last Visited</span>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {bookmark.last_visited ? formatDate(bookmark.last_visited) : "Never"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <Calendar className="size-4" />
                <span className="text-xs">Date Added</span>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {formatDate(bookmark.created_at)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <Separator />
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleVisit} className="gap-2">
              <ExternalLink className="size-4" />
              Visit Website
            </Button>
            <Button onClick={handleCopyUrl} variant="outline" className="gap-2">
              <Copy className="size-4" />
              Copy URL
            </Button>
            <Button onClick={handleTogglePin} variant="outline" className="gap-2">
              <Pin className="size-4" />
              {bookmark.is_pinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button onClick={handleToggleArchive} variant="outline" className="gap-2">
              {bookmark.is_archived ? (
                <>
                  <ArchiveRestore className="size-4" />
                  Restore
                </>
              ) : (
                <>
                  <Archive className="size-4" />
                  Archive
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

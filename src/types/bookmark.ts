export type SortOption = 'recent' | 'visited' | 'views';

export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  url: string;
  is_archived: boolean;
  is_pinned: boolean;
  view_count: number;
  last_visited: string | null;
  created_at: string;
  tags?: string[];
}
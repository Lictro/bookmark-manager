import { formatDistanceToNow } from "date-fns";

export const formatDate = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
  });
};

export const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return '';
  }
};
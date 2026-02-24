"use client";

import { SortOption } from "@/types/bookmark";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";


interface BookmarkUIContextType {
  searchQuery: string;
  selectedTags: string[];
  sortBy: SortOption;
  showArchived: boolean;
  theme: "light" | "dark";
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSortBy: (sort: SortOption) => void;
  setShowArchived: (show: boolean) => void;
  toggleTheme: () => void;
}

const BookmarkUIContext = createContext<
  BookmarkUIContextType | undefined
>(undefined);

export const useBookmarkUI = () => {
  const context = useContext(BookmarkUIContext);
  if (!context) {
    throw new Error("useBookmarkUI must be used within BookmarkUIProvider");
  }
  return context;
};

export const BookmarkUIProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showArchived, setShowArchived] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;

    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BookmarkUIContext.Provider
      value={{
        searchQuery,
        selectedTags,
        sortBy,
        showArchived,
        theme,
        setSearchQuery,
        setSelectedTags,
        setSortBy,
        setShowArchived,
        toggleTheme,
      }}
    >
      {children}
    </BookmarkUIContext.Provider>
  );
};
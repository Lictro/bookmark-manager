"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Moon,
  Sun,
  SortAsc,
  LogOut,
} from "lucide-react";

import { useBookmarkUI } from "@/context/BookmarkUIContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortOption } from "@/types/bookmark";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { BookmarkDialog } from "./BookmarkDialog";
import { MobileSidebar } from "./MobileSidebar";

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    theme,
    toggleTheme,
    showArchived,
  } = useBookmarkUI();

  const { user, signOut } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Recently added" },
    { value: "visited", label: "Recently visited" },
    { value: "views", label: "Most visited" },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label ||
    "Recently added";

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    if (user?.email) {
      return user.email[0].toUpperCase();
    }

    return "U";
  };

  return (
    <>
      <header className="border-b bg-background">
        <div className="flex items-center justify-between px-6 py-4">   
          <MobileSidebar />
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SortAsc className="size-4" />
                  <span className="hidden sm:inline">{currentSortLabel}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme */}
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>

            {/* Add */}
            {!showArchived && (
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="size-4" />
                <span className="hidden sm:inline">Add Bookmark</span>
              </Button>
            )}

            {/* User */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-10 rounded-full">
                  <Avatar>
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.user_metadata?.name && (
                      <p className="font-medium">{user.user_metadata.name}</p>
                    )}
                    {user?.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="size-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <BookmarkDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};
"use client";

import { Input } from "@/components/ui/input";
import { useKanbanStore } from "@/lib/store";

export default function SearchBar() {
  const searchQuery = useKanbanStore((s) => s.searchQuery);
  const setSearchQuery = useKanbanStore((s) => s.setSearchQuery);

  return (
    <Input
      placeholder="검색..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}

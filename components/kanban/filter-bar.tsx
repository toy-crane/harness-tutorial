"use client";

import { useKanbanStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import type { Priority } from "@/lib/types";

const PRIORITY_OPTIONS: (Priority | "All")[] = ["All", "High", "Medium", "Low"];

export default function FilterBar() {
  const priorityFilter = useKanbanStore((s) => s.priorityFilter);
  const setPriorityFilter = useKanbanStore((s) => s.setPriorityFilter);
  const tagFilter = useKanbanStore((s) => s.tagFilter);
  const setTagFilter = useKanbanStore((s) => s.setTagFilter);
  const cards = useKanbanStore((s) => s.cards);

  // Derive unique tags from all cards
  const allTags = new Set<string>();
  for (const card of Object.values(cards)) {
    for (const tag of card.tags) {
      allTags.add(tag);
    }
  }
  const tagOptions = ["All", ...allTags];

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1">
        <label id="priority-filter-label" className="text-xs text-muted-foreground">
          우선순위 필터
        </label>
        <div className="flex gap-1" role="group" aria-labelledby="priority-filter-label">
          {PRIORITY_OPTIONS.map((p) => (
            <Button
              key={p}
              variant={priorityFilter === p ? "default" : "outline"}
              size="sm"
              aria-label={p === "All" ? "우선순위 필터 전체" : undefined}
              onClick={() => setPriorityFilter(p)}
            >
              {p === "All" ? "전체" : p}
            </Button>
          ))}
        </div>
      </div>

      {allTags.size > 0 && (
        <div className="flex flex-col gap-1">
          <label id="tag-filter-label" className="text-xs text-muted-foreground">
            태그 필터
          </label>
          <div className="flex gap-1" role="group" aria-labelledby="tag-filter-label">
            {tagOptions.map((tag) => (
              <Button
                key={tag}
                variant={
                  (tag === "All" && tagFilter === "") || tagFilter === tag
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setTagFilter(tag === "All" ? "" : tag)}
              >
                {tag === "All" ? "전체" : tag}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

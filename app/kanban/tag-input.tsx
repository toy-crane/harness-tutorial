"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useKanbanStore } from "./store";

interface TagInputProps {
  cardId: string;
  tags: string[];
}

export function TagInput({ cardId, tags }: TagInputProps) {
  const [input, setInput] = useState("");
  const updateCard = useKanbanStore((s) => s.updateCard);
  const cards = useKanbanStore((s) => s.cards);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    Object.values(cards).forEach((card) => {
      card.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [cards]);

  const suggestions = useMemo(() => {
    if (!input.trim()) return [];
    return allTags.filter(
      (tag) => tag.includes(input) && !tags.includes(tag)
    );
  }, [input, allTags, tags]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    updateCard(cardId, { tags: [...tags, trimmed] });
    setInput("");
  };

  const removeTag = (tag: string) => {
    updateCard(cardId, { tags: tags.filter((t) => t !== tag) });
  };

  return (
    <div>
      <Label>태그</Label>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`${tag} 제거`}
              onClick={() => removeTag(tag)}
              className="ml-0.5 h-3 w-3"
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="relative mt-1">
        <Input
          placeholder="태그 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(input);
            }
          }}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border bg-popover p-1 text-sm">
            {suggestions.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="w-full rounded px-2 py-1 text-left hover:bg-accent"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

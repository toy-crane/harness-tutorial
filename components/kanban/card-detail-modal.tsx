"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useKanbanStore } from "@/lib/store";
import type { Priority } from "@/lib/types";

interface CardDetailModalProps {
  cardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRIORITIES: Priority[] = ["High", "Medium", "Low", "None"];

export default function CardDetailModal({ cardId, open, onOpenChange }: CardDetailModalProps) {
  const card = useKanbanStore((s) => s.cards[cardId]);
  const updateCard = useKanbanStore((s) => s.updateCard);
  const [tagInput, setTagInput] = useState("");

  if (!card) return null;

  function handleTitleChange(newTitle: string) {
    updateCard(cardId, { title: newTitle });
  }

  function handleDescriptionChange(desc: string) {
    updateCard(cardId, { description: desc });
  }

  function handlePriorityChange(priority: Priority) {
    updateCard(cardId, { priority });
  }

  function handleAddTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !card.tags.includes(trimmed)) {
      updateCard(cardId, { tags: [...card.tags, trimmed] });
    }
    setTagInput("");
  }

  function handleRemoveTag(tag: string) {
    updateCard(cardId, { tags: card.tags.filter((t) => t !== tag) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>카드 상세</DialogTitle>
          <DialogDescription>카드 정보를 편집하세요</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-title">제목</Label>
            <Input
              id="card-title"
              value={card.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-description">설명</Label>
            <Textarea
              id="card-description"
              placeholder="설명을 입력하세요"
              value={card.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <Label id="priority-label">우선순위</Label>
            <div className="flex gap-1" role="group" aria-labelledby="priority-label">
              {PRIORITIES.map((p) => (
                <Button
                  key={p}
                  variant={card.priority === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityChange(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-tags">태그</Label>
            <div className="flex gap-2">
              <Input
                id="card-tags"
                placeholder="태그를 입력하세요"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button size="sm" onClick={handleAddTag}>
                추가
              </Button>
            </div>
            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {card.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

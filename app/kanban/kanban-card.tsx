"use client";

import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Card as CardType, ColumnId } from "./store";

interface KanbanCardProps {
  card: CardType;
  column: ColumnId;
  onClick: () => void;
  onDelete: () => void;
}

export function KanbanCard({ card, onClick, onDelete }: KanbanCardProps) {
  return (
    <Card data-testid="kanban-card" size="sm" className="cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="삭제"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">{card.priority}</Badge>
          {card.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          {card.dueDate && (
            <Badge variant="outline">{card.dueDate}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CardType } from "@/types/task";
import SortableCard from "@/components/columnCard/SortableCard";
import { getCardsByColumn } from "@/api/card";

type CardListProps = {
  columnId: number;
  teamId: string;
  initialTasks: CardType[];
  onCardClick: (card: CardType) => void;
};

const ITEMS_PER_PAGE = 6;

export default function CardList({
  columnId,
  initialTasks,
  onCardClick,
}: CardListProps) {
  const [cards, setCards] = useState<CardType[]>(initialTasks);
  const [cursorId, setCursorId] = useState<number | null>(
    initialTasks.length > 0 ? initialTasks[initialTasks.length - 1].id : null
  );
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const fetchMoreCards = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;

    try {
      const res = await getCardsByColumn({
        columnId,
        size: ITEMS_PER_PAGE,
        cursorId: cursorId ?? undefined,
      });

      const newCards = res.cards as CardType[];

      if (newCards.length > 0) {
        setCards((prev) => {
          const existingIds = new Set(prev.map((card) => card.id));
          const uniqueCards = newCards.filter(
            (card) => !existingIds.has(card.id)
          );
          return [...prev, ...uniqueCards];
        });

        setCursorId((prevCursorId) => {
          const newCursor = newCards[newCards.length - 1]?.id ?? prevCursorId;
          return newCursor;
        });
      }

      if (newCards.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("카드 로딩 실패:", error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [columnId, cursorId, hasMore]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreCards();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchMoreCards, hasMore]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = cards.findIndex((card) => card.id === active.id);
    const newIndex = cards.findIndex((card) => card.id === over.id);

    const newOrder = arrayMove(cards, oldIndex, newIndex);
    setCards(newOrder);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-3 w-full grid-cols-1">
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} onClick={onCardClick} />
          ))}
          {hasMore && <div ref={observerRef} className="h-20" />}
        </div>
      </SortableContext>
    </DndContext>
  );
}

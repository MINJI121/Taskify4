import { useEffect, useRef, useState, useCallback } from "react";
import { CardType } from "@/types/task";
import Card from "./Card";
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

  /* cursorId 업데이트 방식 변경 */
  const fetchMoreCards = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;

    try {
      const res = await getCardsByColumn({
        columnId,
        size: ITEMS_PER_PAGE,
        cursorId: cursorId ?? undefined, // 최신 cursorId 사용
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

        // cursorId 안전하게 업데이트
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

  /* 무한 스크롤 */
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

  return (
    <div className="grid gap-3 w-full grid-cols-1">
      {cards.map((task) => (
        <Card
          key={task.id}
          {...task}
          assignee={task.assignee}
          onClick={() => onCardClick(task)}
        />
      ))}
      {hasMore && <div ref={observerRef} className="h-20" />}
    </div>
  );
}

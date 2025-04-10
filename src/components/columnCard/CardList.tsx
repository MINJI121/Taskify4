import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CardType } from "@/types/task";
import SortableCard from "@/components/columnCard/SortableCard";
import { getCardsByColumn } from "@/api/card";

export type CardListRef = {
  refetch: () => void;
};

type CardListProps = {
  columnId: number;
  teamId: string;
  initialTasks: CardType[];
  onCardClick: (card: CardType) => void;
};

const ITEMS_PER_PAGE = 6;

export const CardList = forwardRef<CardListRef, CardListProps>(
  ({ columnId, initialTasks, onCardClick }, ref) => {
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

    // 카드 로딩
    const fetchAllCards = async () => {
      try {
        const res = await getCardsByColumn({ columnId });
        setCards(res.cards);
        setCursorId(
          res.cards.length > 0 ? res.cards[res.cards.length - 1].id : null
        );
        setHasMore(res.cards.length >= ITEMS_PER_PAGE);
      } catch (err) {
        console.error("카드 전체 로딩 실패:", err);
      }
    };

    useImperativeHandle(ref, () => ({
      refetch: fetchAllCards,
    }));

    // 스크롤 시 추가 로딩
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

          setCursorId(
            newCards.length > 0 ? newCards[newCards.length - 1].id : cursorId
          );
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

    // 무한 스크롤
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

    useEffect(() => {
      fetchAllCards();
    }, [columnId]);

    // 마감일 빠른 순 정렬
    const sortedCards = [...cards].sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    });

    // 드래그 & 드롭
    const handleDragEnd = (event: DragEndEvent) => {
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
          items={sortedCards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-3 w-full grid-cols-1">
            {sortedCards.map((card) => (
              <SortableCard key={card.id} card={card} onClick={onCardClick} />
            ))}
            {hasMore && <div ref={observerRef} className="h-20" />}
          </div>
        </SortableContext>
      </DndContext>
    );
  }
);

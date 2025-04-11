import { useEffect, useState, useRef } from "react";
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
import { getCardsByColumn } from "@/api/card";
import SortableCard from "@/components/columnCard/SortableCard";
import { toast } from "react-toastify";

interface CardListProps {
  columnId: number;
  teamId: string;
  initialTasks: CardType[];
  onCardClick: (card: CardType) => void;
  scrollRoot?: React.RefObject<HTMLDivElement | null>;
}

export const CardList = ({
  initialTasks,
  columnId,
  onCardClick,
  scrollRoot,
}: CardListProps) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // 카드 목록 api 호출 (마감일 빠른 순 정렬)
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await getCardsByColumn({ columnId });
        const sorted = [...res.cards].sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        });
        setCards(sorted);
      } catch (error) {
        console.error("카드 불러오기 실패:", error);
        toast.error("카드를 불러오는 데 실패했습니다.");
      }
    };

    fetchCards();
  }, [columnId, initialTasks]);

  // 스크롤 감지
  useEffect(() => {
    if (!scrollRoot?.current || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
        }
      },
      {
        root: scrollRoot.current,
        threshold: 1.0,
      }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [scrollRoot]);

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
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="w-full grid grid-cols-1 gap-3">
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} onClick={onCardClick} />
          ))}
          <div ref={observerRef} className="h-[1px] bg-transparent" />
        </div>
      </SortableContext>
    </DndContext>
  );
};

import { useEffect, useState, useRef } from "react";
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

  // 스크롤
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

  return (
    <div className="w-full grid grid-cols-1 gap-3">
      {cards.map((card) => (
        <SortableCard key={card.id} card={card} onClick={onCardClick} />
      ))}
      <div ref={observerRef} className="h-[1px] bg-transparent" />
    </div>
  );
};

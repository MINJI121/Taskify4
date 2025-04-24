import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "@/components/columnCard/Card";
import { CardType } from "@/types/task";

interface SortableCardProps {
  card: CardType;
  onClick: (card: CardType) => void;
}

export default function SortableCard({ card, onClick }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: 5,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card {...card} onClick={() => onClick(card)} assignee={card.assignee} />
    </div>
  );
}

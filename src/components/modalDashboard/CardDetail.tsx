import { useEffect, useState } from "react";
import Image from "next/image";
import { CardDetailType } from "@/types/cards";
import { ColumnNameTag } from "../modalInput/chips/ColumnNameTag";
import ColorTagChip, {
  getTagColor,
} from "@/components/modalInput/chips/ColorTagChip";
import { PopupImageModal } from "./PopupImageModal";

interface CardDetailProps {
  card: CardDetailType;
  columnName: string;
}

export default function CardDetail({ card, columnName }: CardDetailProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardDetailType>(card);

  useEffect(() => {
    setCurrentCard(card);
  }, [card]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 내용 */}
      <p
        className="text-black font-normal sm:text-[16px] text-[14px] overflow-auto pr-1
      w-full lg:max-w-[445px] sm:max-w-[420px] max-w-[295px]
      min-h-0 sm:max-h-[140px] max-h-[80px]
      whitespace-pre-wrap word-break break-words"
      >
        {currentCard.description}
      </p>

      {/* 이미지 */}
      {currentCard.imageUrl && (
        <div
          className="md:w-[420px] lg:w-[445px] cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
        >
          <Image
            src={currentCard.imageUrl}
            alt="카드 이미지"
            width={290}
            height={168}
            className="rounded-lg object-cover
              lg:w-[445px] md:w-[420px]
              lg:h-[280px] md:h-[240px]
              sm:max-h-none max-h-[180px]"
          />
        </div>
      )}

      {/* 상태 + 태그 */}
      <div className="flex flex-wrap items-center gap-5">
        <ColumnNameTag label={columnName} />
        <div className="w-[1px] h-[20px] bg-[var(--color-gray3)]" />
        <div className="flex flex-wrap gap-[6px]">
          {currentCard.tags.map((tag, idx) => {
            const { textColor, bgColor } = getTagColor(idx);
            return (
              <ColorTagChip key={idx} className={`${textColor} ${bgColor}`}>
                {tag}
              </ColorTagChip>
            );
          })}
        </div>
      </div>

      {isImageModalOpen && currentCard.imageUrl && (
        <PopupImageModal
          imageUrl={currentCard.imageUrl}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </div>
  );
}

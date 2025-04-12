// 이미지 클릭 시 확대 모달 오픈
import { useRef } from "react";
import Image from "next/image";
import { useClosePopup } from "@/hooks/useClosePopup";

interface PopupImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const PopupImageModal = ({
  imageUrl,
  onClose,
}: PopupImageModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useClosePopup(ref, onClose);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        ref={ref}
        className="relative bg-white rounded-md p-2 cursor-default
        min-h-0 min-w-0"
        // onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt="확대 이미지"
          width={600}
          height={600}
          objectFit="contain"
          className="object-contain rounded-md
          w-full h-auto
          max-w-[80vw]
          max-h-[80vh]
          lg:max-w-[800px] sm:max-w-[400px]"
          unoptimized // 외부 이미지면 성능 최적화 해제
        />
      </div>
    </div>
  );
};

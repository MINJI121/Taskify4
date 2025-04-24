import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import AddButton from "./AddButton";
import { uploadCardImage } from "@/api/card";
import { toast } from "react-toastify";

interface ModalImageProps {
  label: string;
  columnId: number;
  defaultImageUrl?: string;
  onImageSelect: (imageUrl: string) => void; // ✅ string만 넘김
}

export default function ModalImage({
  label,
  columnId,
  defaultImageUrl,
  onImageSelect,
}: ModalImageProps) {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 기존 이미지 표시
  useEffect(() => {
    if (defaultImageUrl) {
      setBackgroundImage(defaultImageUrl);
    }
  }, [defaultImageUrl]);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기용
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string;
      setBackgroundImage(imageSrc);
    };
    reader.readAsDataURL(file);

    // ✅ 업로드 후 URL 전달
    try {
      const imageUrl = await uploadCardImage({
        columnId,
        imageFile: file,
      });
      onImageSelect(imageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-2.5">
      <label
        htmlFor="comment"
        className="text-black3 font-medium text-[14px] sm:text-[18px]"
      >
        {label}
      </label>
      <button
        type="button"
        onClick={handleFileInputClick}
        className="group relative flex w-[76px] h-[76px] shrink-0 items-center justify-center rounded-md
        border border-[#F5F5F5] cursor-pointer"
      >
        {backgroundImage ? (
          <>
            <Image
              src={backgroundImage}
              fill
              alt="Selected Image"
              className="rounded-md object-cover"
              unoptimized
            />
            <div className="z-10 flex w-[76px] h-[76px] items-center justify-center rounded-md bg-black4 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-60">
              <Image
                src="/svgs/modal-edit-logo.svg"
                width={30}
                height={30}
                alt="Edit Image Icon"
              />
            </div>
          </>
        ) : (
          <div className="rounded-md bg-[#F5F5F5] p-6">
            <AddButton bgColor="todoBg" size="todoSize" />
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </button>
    </div>
  );
}

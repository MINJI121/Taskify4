import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import AddButton from "./AddButton";
import { uploadCardImage } from "@/api/card";

interface ModalImageProps {
  label: string;
  teamId: string;
  columnId: number;
  onImageSelect: (imageUrl: string) => void;
}

export default function ModalImage({
  label,
  teamId,
  columnId,
  onImageSelect,
}: ModalImageProps) {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string;
      setBackgroundImage(imageSrc);
    };
    reader.readAsDataURL(file);

    try {
      const imageUrl = await uploadCardImage({
        teamId,
        columnId,
        imageFile: file, // ✅ File만 넘김
      });
      onImageSelect(imageUrl); // 부모로 전달
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했어요.");
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-2.5">
      <label htmlFor="comment" className="font-18m text-[var(--color-black)]">
        {label}
      </label>
      <button
        type="button"
        onClick={handleFileInputClick}
        className="group relative flex w-[76px] h-[76px] shrink-0 items-center justify-center rounded-md bg-[var(--color-white)] border border-[var(--color-gray3)]"
      >
        {backgroundImage ? (
          <>
            <Image
              src={backgroundImage}
              fill
              alt="Selected Image"
              className="rounded-md"
              unoptimized
            />
            <div className="z-10 flex w-[76px] h-[76px] items-center justify-center rounded-md bg-[var(--color-black4)] opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-60">
              <Image
                src="/svgs/modal-edit-logo.svg"
                width={30}
                height={30}
                alt="Edit Image Icon"
              />
            </div>
          </>
        ) : (
          <div className="rounded-md bg-[var(--color-gray3)] p-6">
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

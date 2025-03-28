import moment from "moment";
import Image from "next/image";
import { ChangeEvent, useState, KeyboardEvent, useEffect } from "react";
import Datetime from "react-datetime";
import ColorTagChip, { getTagColor } from "./chips/ColorTagChip";
import { inputClassNames } from "./InputClassNames";
import clsx from "clsx";

type ModalInputType = "제목" | "마감일" | "태그";

interface ModalInputProps {
  label: ModalInputType;
  required?: boolean;
  onValueChange: (newValues: string[]) => void;
  defaultValue?: string;
  defaultValueArray?: string[];
}

interface Tag {
  text: string;
  textColor: string;
  bgColor: string;
}

export default function ModalInput({
  label,
  required,
  onValueChange,
  defaultValue = "",
  defaultValueArray = [],
}: ModalInputProps) {
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultValue);

  useEffect(() => {
    if (label === "태그" && defaultValueArray.length > 0) {
      const initialTags = defaultValueArray.map((text, index) => ({
        text,
        ...getTagColor(index),
      }));
      setTags(initialTags);
    }
  }, [label, defaultValueArray]);

  const handleTitleValue = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange([event.target.value]);
  };

  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim() !== "") {
      if (tags.some((tag) => tag.text === tagInput.trim())) {
        setTagInput("");
        return;
      }

      const newTag: Tag = {
        text: tagInput.trim(),
        ...getTagColor(tags.length),
      };

      const newTags = [...tags, newTag];
      setTags(newTags);
      onValueChange(newTags.map((tag) => tag.text));
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagText: string) => {
    const updatedTags = tags.filter((tag) => tag.text !== tagText);
    setTags(updatedTags);
    onValueChange(updatedTags.map((tag) => tag.text));
  };

  // ✅ 마감일 포맷 수정 (YYYY-MM-DD HH:mm)
  const handleDateChange = (date: moment.Moment | string) => {
    if (moment.isMoment(date)) {
      const formatted = date.format("YYYY-MM-DD HH:mm"); // ← 이 줄이 핵심!
      setSelectedDate(formatted);
      onValueChange([formatted]);
    } else {
      setSelectedDate(date);
      onValueChange([date]);
    }
    setIsCalendarOpen(false);
  };

  let inputElement = null;

  switch (label) {
    case "제목":
      inputElement = (
        <input
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
          defaultValue={defaultValue}
          className="w-full max-w-[520px] h-[48px] rounded-md font-18r outline-none px-2 sm:px-4 border border-[var(--color-gray3)] focus:border-[var(--primary)]"
          onChange={handleTitleValue}
        />
      );
      break;

    case "마감일":
      inputElement = (
        <div className="relative w-full max-w-[520px]">
          <div
            className="flex items-center gap-2 w-full h-[48px] border border-[var(--color-gray3)] rounded-md px-2 sm:px-4 cursor-pointer focus-within:border-[var(--primary)]"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <Image
              src="/svgs/calendar.svg"
              width={20}
              height={20}
              alt="Deadline"
              priority
            />
            <input
              type="text"
              placeholder="날짜를 입력해주세요"
              value={selectedDate}
              className="w-full h-full font-18r outline-none bg-transparent"
              readOnly
            />
          </div>

          {isCalendarOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-full max-w-[520px] z-50 bg-white border border-[var(--color-gray3)] rounded-md shadow-lg"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Datetime
                dateFormat="YYYY.MM.DD"
                timeFormat="HH:mm"
                input={false}
                onChange={handleDateChange}
              />
            </div>
          )}
        </div>
      );
      break;

    case "태그":
      inputElement = (
        <div className="flex flex-wrap items-center gap-2 w-full max-w-[520px] min-h-[48px] border border-[var(--color-gray3)] rounded-md px-2 sm:px-4 overflow-x-auto scrollbar-hide focus-within:border-[var(--primary)]">
          {tags.map((tag, index) => (
            <ColorTagChip
              key={index}
              onTagClick={() => handleDeleteTag(tag.text)}
              className={clsx(
                tag.textColor,
                tag.bgColor,
                "px-3 py-1 rounded-lg font-14r"
              )}
            >
              {tag.text}
            </ColorTagChip>
          ))}
          <input
            type="text"
            name="tag"
            id="tag"
            value={tagInput}
            placeholder="입력 후 Enter"
            onChange={handleTagInputChange}
            onKeyDown={handleAddTag}
            className="flex-grow min-w-[100px] h-full border-none font-18r outline-none"
          />
        </div>
      );
      break;
  }

  return (
    <div className="inline-flex flex-col items-start gap-2.5 w-full">
      <p className={inputClassNames.label}>
        {label}{" "}
        {required && <span className="text-[var(--color-purple)]">*</span>}
      </p>
      <div className="w-full">{inputElement}</div>
    </div>
  );
}

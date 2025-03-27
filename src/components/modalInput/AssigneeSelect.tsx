import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

interface AssigneeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

const ASSIGNEES = ["배유철", "배동석", "이지은"];

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

function getColor(index: number) {
  const colors = ["bg-[#A0E6FF]", "bg-[#FFD29D]", "bg-[#C2A1FF]"];
  return colors[index % colors.length];
}

export default function AssigneeSelect({
  value,
  onChange,
  label,
  required,
}: AssigneeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filtered = ASSIGNEES.filter((name) => name.includes(filter));

  return (
    <div className="inline-flex flex-col items-start gap-2.5 w-full max-w-[520px]">
      {label && (
        <p className="font-18m text-[var(--color-black)]">
          {label}{" "}
          {required && <span className="text-[var(--color-purple)]">*</span>}
        </p>
      )}

      <div className="relative w-full">
        <div
          className="flex items-center justify-between h-[48px] px-4 border border-[var(--color-gray3)] rounded-md cursor-pointer focus-within:border-[var(--primary)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "w-6 h-6 rounded-full text-xs text-white flex items-center justify-center",
                getColor(ASSIGNEES.indexOf(value))
              )}
            >
              {getInitial(value)}
            </span>
            <span className="font-18r">{value || "이름을 입력해주세요"}</span>
          </div>
          <Image
            src="/svgs/arrow-down.svg"
            width={20}
            height={20}
            alt="dropdown"
          />
        </div>

        {isOpen && (
          <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-[var(--color-gray3)] rounded-md shadow-lg z-10">
            {filtered.map((name, idx) => (
              <li
                key={idx}
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                  setFilter("");
                }}
                className="px-4 py-2 cursor-pointer hover:bg-[var(--color-gray1)] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "w-6 h-6 rounded-full text-xs text-white flex items-center justify-center",
                      getColor(idx)
                    )}
                  >
                    {getInitial(name)}
                  </span>
                  <span className="text-sm">{name}</span>
                </div>
                {value === name && (
                  <span className="text-[var(--primary)]">✔</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

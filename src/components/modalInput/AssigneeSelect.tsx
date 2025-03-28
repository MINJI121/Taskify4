import { useState } from "react";

interface AssigneeSelectProps {
  value: string;
  onChange: (value: string) => void;
  users: string[]; // users는 string[]이어야 합니다.
  label?: string;
  required?: boolean;
}

export default function AssigneeSelect({
  value,
  onChange,
  users,
  label,
  required,
}: AssigneeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filtered = users.filter((name) =>
    name.toLowerCase().includes(filter.toLowerCase() || "")
  );

  return (
    <div className="inline-flex flex-col items-start gap-2.5 w-full max-w-[520px]">
      {label && (
        <p className="font-18m text-[var(--color-black)]">
          {label}
          {required && <span className="text-[var(--color-purple)]">*</span>}
        </p>
      )}

      <div className="relative w-full">
        <div
          className="flex items-center justify-between h-[48px] px-4 border border-[var(--color-gray3)] rounded-md cursor-pointer focus-within:border-[var(--primary)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            {value ? (
              <>
                <span className="w-6 h-6 rounded-full text-xs text-white flex items-center justify-center bg-[#A0E6FF]">
                  {value.charAt(0).toUpperCase()}
                </span>
                <span className="font-18r">{value}</span>
              </>
            ) : (
              <span className="font-18r text-[var(--color-gray2)]">
                이름을 입력해주세요
              </span>
            )}
          </div>
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
                <span className="text-sm">{name}</span>
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

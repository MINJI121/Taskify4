interface ColumnNameTagProps {
  label: string;
}

export const ColumnNameTag = ({ label }: ColumnNameTagProps) => {
  return (
    <div className="gap-[6px] px-3 py-1 flex items-center bg-[#F3EDFF] rounded-full">
      <span className="w-[6px] h-[6px] rounded-full bg-[var(--primary)]" />
      <span className="text-[var(--primary)] font-normal sm:text-[14px] text-[12px]">
        {label}
      </span>
    </div>
  );
};

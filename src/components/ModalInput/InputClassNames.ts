export const inputClassNames = {
  container:
    "relative rounded-md border border-solid border-gray3 bg-white focus-within:outline-none focus-within:ring-[1px] focus-within:ring-violet2",
  inputStyle: "flex items-center gap-[10px] px-4 text-base font-normal",
  textareaStyle:
    "flex flex-col items-start gap-[10px] p-4 text-sm sm:text-xs font-normal",
  dropdownOptions:
    "absolute z-10 mt-0.5 flex w-[217px] flex-col rounded-md border border-solid border-gray3 bg-white shadow-[0_4px_20px_0_rgba(0,0,0,0.08)]",
  label: "text-lg font-medium",
  // 사이즈를 결정하는 키워드
  type: {
    dropdown: "h-12 w-[217px]",
    input: "h-12 w-[450px]",
    textarea: "min-h-[110px] w-[450px] sm:w-[287px] sm:min-h-[70px]",
  },
};

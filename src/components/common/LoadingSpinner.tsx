import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="fixed inset-0 z-60 flex justify-center items-center
    bg-white transition-opacity duration-300"
    >
      <div className="w-12 h-12 border-6 border-[var(--primary)] border-solid rounded-full animate-spin border-t-transparent" />
    </div>
  );
};

export default LoadingSpinner;

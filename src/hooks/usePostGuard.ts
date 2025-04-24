import { useRef, useState } from "react";

export function usePostGuard() {
  const isPosting = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const guard = async <T>(callback: () => Promise<T>): Promise<T | null> => {
    if (isPosting.current) return null;

    isPosting.current = true;
    setIsLoading(true);

    try {
      return await callback();
    } catch (err) {
      throw err;
    } finally {
      isPosting.current = false;
      setIsLoading(false);
    }
  };

  return { guard, isLoading };
}

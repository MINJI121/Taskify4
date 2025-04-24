import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  const goToMain = () => {
    router.push("/");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(var(--vh)_*_100)] bg-gray5 gap-2">
      <h1 className="text-24-b text-primary">404 Not Found</h1>
      <p className="text-16-r text-black3">페이지를 찾을 수 없습니다.</p>
      <p className="text-16-r text-black3">5초 후 홈페이지로 이동합니다.</p>
      <button
        onClick={goToMain}
        className="w-[200px] h-[50px] bg-primary text-16-m text-white rounded-lg cursor-pointer"
      >
        홈페이지 이동하기
      </button>
    </div>
  );
}

Custom404.hideHeader = true;

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import HeaderDefault from "@/components/gnb/HeaderDefault";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = router.pathname;

  const isDashboardPage = pathname.startsWith("/dashboard");
  // 헤더 숨길 페이지
  const noHeaderRoutes = ["/login", "/signup", "/mydashboard", "/mypage"];
  const isHeaderHidden =
    (Component as any).hideHeader ||
    noHeaderRoutes.includes(pathname) ||
    isDashboardPage;

  // 상황별 헤더 분기
  const isLandingPage = pathname === "/";

  const renderHeader = () => {
    if (isHeaderHidden) return null;
    if (isLandingPage) return <HeaderDefault variant="black" />;
    return <HeaderDefault />;
  };

  return (
    <>
      {renderHeader()}
      <Component {...pageProps} />
    </>
  );
}

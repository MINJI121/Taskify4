import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import GlobalRouteLoadingWatcher from "@/components/common/GlobalRouteLoadingWatcher";
import useLoadingStore from "@/store/useLoadingStore";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import HeaderDefault from "@/components/gnb/HeaderDefault";
import { getUserInfo } from "@/api/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomToastContainer from "@/components/common/CustomToastContainer";

type NextPageWithLayout = NextPage & {
  hideHeader?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // React Query Client 생성
  const [queryClient] = useState(() => new QueryClient());

  // 로딩 상태 관리
  const isLoading = useLoadingStore((state) => state.isLoading);

  // 앱 최초 실행 시 로그인 여부 판단
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const userData = await getUserInfo();
          useUserStore.getState().setUser(userData);
        } catch {
          useUserStore.getState().clearUser();
        }
      } else {
        useUserStore.getState().clearUser();
        localStorage.removeItem("accessToken");
      }
    };

    initializeUser();
  }, []);

  // 윈도우 기준 높이 사용
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  const router = useRouter();
  const pathname = router.pathname;

  // 헤더 기본 출력 설정
  const isDashboardPage = pathname.startsWith("/dashboard");
  // 헤더 숨길 페이지
  const noHeaderRoutes = ["/login", "/signup", "/mydashboard", "/mypage"];
  const isHeaderHidden =
    Component.hideHeader ||
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
    <QueryClientProvider client={queryClient}>
      <GlobalRouteLoadingWatcher />
      {isLoading && <LoadingSpinner />}
      {renderHeader()}
      <Component {...pageProps} />
      <CustomToastContainer />
    </QueryClientProvider>
  );
}

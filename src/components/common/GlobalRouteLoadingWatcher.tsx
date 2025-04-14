import { useEffect } from "react";
import { useRouter } from "next/router";
import useLoadingStore from "@/store/useLoadingStore";

export default function GlobalRouteLoadingWatcher() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingStore();

  useEffect(() => {
    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);
    router.events.on("routeChangeError", stopLoading);

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
      router.events.off("routeChangeError", stopLoading);
    };
  }, [router]);

  return null;
}

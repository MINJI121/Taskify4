import { useEffect, useState } from "react";

import Footer from "@/components/landing/Footer";
import LandingMain from "@/components/landing/LandingMain";

export default function Home() {
  const [renderDelayedContent, setRenderDelayedContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderDelayedContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!renderDelayedContent) {
    return null;
  }

  return (
    <>
      <LandingMain />
      <Footer />
    </>
  );
}

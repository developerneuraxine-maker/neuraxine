"use client";

import { useEffect } from "react";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <>{children}</>;
}

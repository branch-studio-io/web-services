"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || window.pageYOffset;
        const maxScroll = doc.scrollHeight - window.innerHeight || 1;
        const progress = scrollTop / maxScroll; // 0..1
        setVisible(progress >= 0.2);
        ticking = false;
      });
    };

    onScroll(); // run once on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={clsx(
        "fixed right-0 bottom-0",
        "bg-navy cursor-pointer border-3 border-white font-sans text-[0.8rem] leading-tight font-semibold uppercase",
        "m-2 rounded-full p-2.5 text-white",
        "transform-gpu will-change-transform",
        "hover:-translate-y-[3px] hover:opacity-[0.85]",
        "transition-all duration-300 ease-out",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
      onClick={handleBackToTop}
    >
      <div className="flex h-[40px] flex-col items-center justify-center">
        Back
        <br />
        to Top
      </div>
    </button>
  );
}

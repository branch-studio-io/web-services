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
        "fixed bottom-0 right-0",
        "cursor-pointer bg-ink border-3 border-white font-sans font-semibold text-[0.8rem] uppercase leading-tight",
        "rounded-full text-white p-2.5 m-2",
        "transform-gpu will-change-transform",
        "hover:-translate-y-[3px] hover:opacity-[0.85]",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none translate-y-2",
      )}
      onClick={handleBackToTop}
    >
      <div className="flex flex-col items-center justify-center h-[40px]">
        Back
        <br />
        to Top
      </div>
    </button>
  );
}

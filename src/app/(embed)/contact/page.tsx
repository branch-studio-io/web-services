"use client";

import Script from "next/script";
import { useEffect } from "react";

const sendHeight = () => {
  if (typeof window === "undefined") return;
  const height = document.body.scrollHeight;
  window.parent.postMessage({ type: "EA_FORM_HEIGHT", height }, "*");
};

export default function ContactEmbed() {
  useEffect(() => {
    // Run once when the iframe content is ready
    const handleLoad = () => {
      sendHeight();
    };
    window.addEventListener("load", handleLoad);
    // Keep sending height periodically in case form expands/collapses
    const intervalId = window.setInterval(sendHeight, 500);
    return () => {
      window.removeEventListener("load", handleLoad);
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <div
        className="ngp-form"
        data-form-url="https://secure.everyaction.com/v1/Forms/BJGR7vvuakeLz4_xw35YNQ2"
        data-fastaction-endpoint="https://fastaction.ngpvan.com"
        data-inline-errors="true"
        data-fastaction-nologin="true"
        data-mobile-autofocus="false"
      ></div>

      <Script
        src="https://static.everyaction.com/ea-actiontag/at.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

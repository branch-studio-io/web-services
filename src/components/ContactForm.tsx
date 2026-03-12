"use client";

import AnnouncePill from "@/components/AnnouncePill";
import { useEffect, useRef, useState } from "react";
import { BsSubstack } from "react-icons/bs";
import {
  FaBluesky,
  FaFacebookF,
  FaInstagram,
  FaThreads,
  FaYoutube,
} from "react-icons/fa6";

const socialNav = [
  {
    name: "Substack",
    href: "https://thecivicscenter.substack.com/",
    logo: BsSubstack,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/thecivicscenter",
    logo: FaInstagram,
  },
  {
    name: "Threads",
    href: "https://www.threads.com/@thecivicscenter",
    logo: FaThreads,
  },
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/thecivicscenter.bsky.social",
    logo: FaBluesky,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/TheCivicsCenter/",
    logo: FaFacebookF,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@TheCivicsCenter",
    logo: FaYoutube,
  },
];

export default function ContactForm() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(480);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.data &&
        event.data.type === "EA_FORM_HEIGHT" &&
        typeof event.data.height === "number"
      ) {
        setIframeHeight(event.data.height);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="bg-teal">
      <div className="flex flex-col justify-between lg:flex-row">
        <div className="mx-auto flex w-full flex-col gap-y-10 px-6 py-16 lg:px-8">
          <AnnouncePill text="ADD YOUR NAME" icon={true} />
          <div className="space-y-4">
            <h2 className="header-sqsp-2">Signing Up Shows Your Support</h2>
            <p className="body-md">
              By adding your name, you&rsquo;re not just staying informed —
              you&rsquo;re helping us show funders and partners the growing
              movement to improve youth voter engagement!
            </p>
            <p className="body-md">
              Stay connected with updates, results from our campaigns, and the
              latest insights on youth voter engagement.
            </p>
          </div>
          <div className="flex flex-row flex-wrap gap-[18px]">
            {socialNav.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <item.logo className="size-8 text-white transition-opacity duration-300 ease-in-out hover:opacity-80" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full space-y-4 px-3 py-0 lg:px-0 lg:py-16">
          <iframe
            ref={iframeRef}
            src={"/contact/"}
            title="EveryAction Form"
            width="100%"
            height={`${iframeHeight}px`}
            className="w-full xl:max-w-[600px]"
            style={{ border: "none", overflow: "hidden" }}
          />
          <div className="mx-auto px-6 pb-16 text-lg font-medium text-white lg:px-8">
            For press inquiries, please see our{" "}
            <a
              href="https://docs.google.com/forms/d/15h0_pjnMVq6ovMk7iashMmrN4DSomgE0n43kYGy93tc/edit?ts=68f57c0e&pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              inquiry form
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

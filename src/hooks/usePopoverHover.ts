import { useEffect, useRef } from "react";

export const usePopoverHover = () => {
  const popoverRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const popover = popoverRef.current;
    const button = buttonRef.current;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (!popover || !button) {
      console.warn(
        "usePopoverHover: Please assign popoverRef and buttonRef for this to function correctly.",
      );
      return () => {};
    }

    const enterButton = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (popover.dataset.headlessuiState === "open") {
        return;
      }
      button.click();
    };

    const leaveButton = () => {
      timer = setTimeout(() => {
        button.click();
      }, 100);
    };

    popover.addEventListener("mouseenter", enterButton);
    popover.addEventListener("mouseleave", leaveButton);

    return () => {
      popover.removeEventListener("mouseenter", enterButton);
      popover.removeEventListener("mouseleave", leaveButton);
    };
  }, []);

  return { popoverRef, buttonRef };
};

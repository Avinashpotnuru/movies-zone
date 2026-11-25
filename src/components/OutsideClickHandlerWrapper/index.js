"use client";
import { useEffect, useRef } from "react";

const OutsideClickHandlerWrapper = ({ onOutsideClick, children }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Mobile nav lives outside these desktop dropdown wrappers; clicks inside
      // it must not collapse the desktop accordions and unmount mobile links.
      if (event.target.closest?.("[data-outside-click-ignore]")) return;
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick]);

  return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideClickHandlerWrapper;

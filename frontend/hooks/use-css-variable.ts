"use client";

import { useEffect, useState } from "react";

export function useCssVariable(name: string) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const updateValue = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setValue(computedStyle.getPropertyValue(name).trim());
    };

    updateValue();

    const observer = new MutationObserver(updateValue);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, [name]);

  return value;
}

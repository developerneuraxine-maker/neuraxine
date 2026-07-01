"use client";

import Image from "next/image";
import { useState } from "react";

interface ServiceImageProps {
  slug: string;
  emoji: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

export function ServiceImage({
  slug,
  emoji,
  alt,
  size = 64,
  className = "",
  priority = false,
}: ServiceImageProps) {
  const [source, setSource] = useState<"svg" | "emoji">("svg");

  if (source === "emoji") {
    return (
      <span className={`select-none leading-none ${className}`} role="img" aria-label={alt}>
        {emoji}
      </span>
    );
  }

  return (
    <Image
      src={`/services/${slug}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      onError={() => setSource("emoji")}
      priority={priority}
      unoptimized
    />
  );
}

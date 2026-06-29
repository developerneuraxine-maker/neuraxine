"use client";

import Image from "next/image";
import { useState } from "react";

interface ServiceImageProps {
  slug: string;
  emoji: string;
  size?: number;
  className?: string;
}

export function ServiceImage({ slug, emoji, size = 64, className = "" }: ServiceImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`text-5xl select-none ${className}`} role="img" aria-label={slug}>
        {emoji}
      </span>
    );
  }

  return (
    <Image
      src={`/services/${slug}.svg`}
      alt={slug}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}

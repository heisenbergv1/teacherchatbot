"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type AssistantAvatarProps = {
  src: string;
  alt?: string;
  size?: number; // pixel size for square avatar image inside the 32px container
  className?: string;
};

export function AssistantAvatar({
  src,
  alt = "Don Hector",
  size = 14,
  className,
}: AssistantAvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("object-cover", className)}
      priority
    />
  );
}

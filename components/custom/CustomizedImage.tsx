"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import LoadingPlaceholder from "@/components/custom/LoadingPlaceHolder";

const CustomizedImage = ({
  className,
  ...props
}: {
  className?: string;
} & ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {!isLoaded && <LoadingPlaceholder />}
      <Image
        width={0}
        height={0}
        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "h-full w-full",
          !isLoaded && "opacity-0",
          "max-w-full object-cover transition-opacity duration-300",
        )}
        priority={false}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export { CustomizedImage };

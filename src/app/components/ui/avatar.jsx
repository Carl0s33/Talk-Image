import * as React from "react";
import * as AvatarPrimitivo from "@radix-ui/react-avatar";
import { cn } from "./utils";

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitivo.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function ImagemAvatar({ className, ...props }) {
  return (
    <AvatarPrimitivo.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AlternativaAvatar({ className, ...props }) {
  return (
    <AvatarPrimitivo.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, ImagemAvatar, AlternativaAvatar };

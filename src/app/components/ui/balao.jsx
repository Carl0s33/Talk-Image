import * as React from "react";
import * as BalaoPrimitivo from "@radix-ui/react-popover";
import { cn } from "./utils";

function Balao({ ...props }) {
  return <BalaoPrimitivo.Root data-slot="popover" {...props} />;
}

function GatilhoBalao({ ...props }) {
  return <BalaoPrimitivo.Trigger data-slot="popover-trigger" {...props} />;
}

function ConteudoBalao({ className, align = "center", sideOffset = 4, ...props }) {
  return (
    <BalaoPrimitivo.Portal>
      <BalaoPrimitivo.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </BalaoPrimitivo.Portal>
  );
}

function AncoraBalao({ ...props }) {
  return <BalaoPrimitivo.Anchor data-slot="popover-anchor" {...props} />;
}

export { Balao, GatilhoBalao, ConteudoBalao, AncoraBalao };

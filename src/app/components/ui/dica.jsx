import * as React from "react";
import * as DicaPrimitivo from "@radix-ui/react-tooltip";
import { cn } from "./utils";

function ProvedorDica({ delayDuration = 0, ...props }) {
  return (
    <DicaPrimitivo.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Dica({ ...props }) {
  return (
    <ProvedorDica>
      <DicaPrimitivo.Root data-slot="tooltip" {...props} />
    </ProvedorDica>
  );
}

function GatilhoDica({ ...props }) {
  return <DicaPrimitivo.Trigger data-slot="tooltip-trigger" {...props} />;
}

function ConteudoDica({ className, sideOffset = 0, children, ...props }) {
  return (
    <DicaPrimitivo.Portal>
      <DicaPrimitivo.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <DicaPrimitivo.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </DicaPrimitivo.Content>
    </DicaPrimitivo.Portal>
  );
}

export { Dica, GatilhoDica, ConteudoDica, ProvedorDica };

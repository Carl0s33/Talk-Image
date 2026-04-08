import * as React from "react";
import * as AcordeaoPrimitivo from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "./utils";

function Acordeao({ ...props }) {
  return <AcordeaoPrimitivo.Root data-slot="accordion" {...props} />;
}

function ItemAcordeao({ className, ...props }) {
  return (
    <AcordeaoPrimitivo.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function GatilhoAcordeao({ className, children, ...props }) {
  return (
    <AcordeaoPrimitivo.Header className="flex">
      <AcordeaoPrimitivo.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AcordeaoPrimitivo.Trigger>
    </AcordeaoPrimitivo.Header>
  );
}

function ConteudoAcordeao({ className, children, ...props }) {
  return (
    <AcordeaoPrimitivo.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AcordeaoPrimitivo.Content>
  );
}

export { Acordeao, ItemAcordeao, GatilhoAcordeao, ConteudoAcordeao };

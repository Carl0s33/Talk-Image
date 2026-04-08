import * as React from "react";
import * as PainelPrimitivo from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

function Painel({ ...props }) {
  return <PainelPrimitivo.Root data-slot="sheet" {...props} />;
}

function GatilhoPainel({ ...props }) {
  return <PainelPrimitivo.Trigger data-slot="sheet-trigger" {...props} />;
}

function FecharPainel({ ...props }) {
  return <PainelPrimitivo.Close data-slot="sheet-close" {...props} />;
}

function PortalPainel({ ...props }) {
  return <PainelPrimitivo.Portal data-slot="sheet-portal" {...props} />;
}

function CoberturaPainel({ className, ...props }) {
  return (
    <PainelPrimitivo.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function ConteudoPainel({ className, children, lado = "right", side, ...props }) {
  const ladoReal = lado || side || "right";

  return (
    <PortalPainel>
      <CoberturaPainel />
      <PainelPrimitivo.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          ladoReal === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          ladoReal === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          ladoReal === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          ladoReal === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        <PainelPrimitivo.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Fechar</span>
        </PainelPrimitivo.Close>
      </PainelPrimitivo.Content>
    </PortalPainel>
  );
}

function CabecalhoPainel({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function RodapePainel({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function TituloPainel({ className, ...props }) {
  return (
    <PainelPrimitivo.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function DescricaoPainel({ className, ...props }) {
  return (
    <PainelPrimitivo.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Painel,
  GatilhoPainel,
  FecharPainel,
  ConteudoPainel,
  CabecalhoPainel,
  RodapePainel,
  TituloPainel,
  DescricaoPainel,
};

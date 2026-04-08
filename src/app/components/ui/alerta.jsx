import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

const variantesAlerta = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variante: {
        padrao: "bg-card text-card-foreground",
        destrutivo:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variante: "padrao",
    },
  }
);

function Alerta({ className, variante, variant, ...props }) {
  const varianteReal = variante || variant || "padrao";

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(variantesAlerta({ variante: varianteReal }), className)}
      {...props}
    />
  );
}

function TituloAlerta({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function DescricaoAlerta({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alerta, TituloAlerta, DescricaoAlerta };

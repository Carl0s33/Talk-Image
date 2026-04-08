import * as React from "react";
import * as AlternarPrimitivo from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

const variantesAlternar = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variante: {
        padrao: "bg-transparent",
        contorno:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      tamanho: {
        padrao: "h-9 px-2 min-w-9",
        pequeno: "h-8 px-1.5 min-w-8",
        grande: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variante: "padrao",
      tamanho: "padrao",
    },
  }
);

function Alternar({ className, variante, variant, tamanho, size, ...props }) {
  const varianteReal = variante || variant || "padrao";
  const tamanhoReal = tamanho || size || "padrao";

  return (
    <AlternarPrimitivo.Root
      data-slot="toggle"
      className={cn(variantesAlternar({ variante: varianteReal, tamanho: tamanhoReal, className }))}
      {...props}
    />
  );
}

export { Alternar, variantesAlternar };

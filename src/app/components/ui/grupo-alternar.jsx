import * as React from "react";
import * as GrupoAlternarPrimitivo from "@radix-ui/react-toggle-group";
import { cn } from "./utils";
import { variantesAlternar } from "./alternar";

const ContextoGrupoAlternar = React.createContext({
  tamanho: "padrao",
  variante: "padrao",
});

function GrupoAlternar({ className, variante, variant, tamanho, size, children, ...props }) {
  const varianteReal = variante || variant || "padrao";
  const tamanhoReal = tamanho || size || "padrao";

  return (
    <GrupoAlternarPrimitivo.Root
      data-slot="toggle-group"
      data-variant={varianteReal}
      data-size={tamanhoReal}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      )}
      {...props}
    >
      <ContextoGrupoAlternar.Provider value={{ variante: varianteReal, tamanho: tamanhoReal }}>
        {children}
      </ContextoGrupoAlternar.Provider>
    </GrupoAlternarPrimitivo.Root>
  );
}

function ItemGrupoAlternar({ className, children, variante, variant, tamanho, size, ...props }) {
  const contexto = React.useContext(ContextoGrupoAlternar);
  const varianteReal = contexto.variante || variante || variant;
  const tamanhoReal = contexto.tamanho || tamanho || size;

  return (
    <GrupoAlternarPrimitivo.Item
      data-slot="toggle-group-item"
      data-variant={varianteReal}
      data-size={tamanhoReal}
      className={cn(
        variantesAlternar({ variante: varianteReal, tamanho: tamanhoReal }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </GrupoAlternarPrimitivo.Item>
  );
}

export { GrupoAlternar, ItemGrupoAlternar };

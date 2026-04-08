import * as React from "react";
import * as MenuContextoPrimitivo from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "./utils";

function MenuContexto({ ...props }) {
  return <MenuContextoPrimitivo.Root data-slot="context-menu" {...props} />;
}

function GatilhoMenuContexto({ ...props }) {
  return (
    <MenuContextoPrimitivo.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function GrupoMenuContexto({ ...props }) {
  return (
    <MenuContextoPrimitivo.Group data-slot="context-menu-group" {...props} />
  );
}

function PortalMenuContexto({ ...props }) {
  return (
    <MenuContextoPrimitivo.Portal data-slot="context-menu-portal" {...props} />
  );
}

function SubMenuContexto({ ...props }) {
  return <MenuContextoPrimitivo.Sub data-slot="context-menu-sub" {...props} />;
}

function GrupoRadioMenuContexto({ ...props }) {
  return (
    <MenuContextoPrimitivo.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function GatilhoSubMenuContexto({ className, recuado, inset, children, ...props }) {
  const recuadoReal = recuado || inset;

  return (
    <MenuContextoPrimitivo.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={recuadoReal}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuContextoPrimitivo.SubTrigger>
  );
}

function ConteudoSubMenuContexto({ className, ...props }) {
  return (
    <MenuContextoPrimitivo.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

function ConteudoMenuContexto({ className, ...props }) {
  return (
    <MenuContextoPrimitivo.Portal>
      <MenuContextoPrimitivo.Content
        data-slot="context-menu-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </MenuContextoPrimitivo.Portal>
  );
}

function ItemMenuContexto({ className, recuado, inset, variante = "padrao", variant, ...props }) {
  const recuadoReal = recuado || inset;
  const varianteReal = variante === "padrao" ? "default" : (variant || variante);

  return (
    <MenuContextoPrimitivo.Item
      data-slot="context-menu-item"
      data-inset={recuadoReal}
      data-variant={varianteReal}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function ItemCaixaSelecaoMenuContexto({ className, children, checked, ...props }) {
  return (
    <MenuContextoPrimitivo.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuContextoPrimitivo.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenuContextoPrimitivo.ItemIndicator>
      </span>
      {children}
    </MenuContextoPrimitivo.CheckboxItem>
  );
}

function ItemRadioMenuContexto({ className, children, ...props }) {
  return (
    <MenuContextoPrimitivo.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuContextoPrimitivo.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenuContextoPrimitivo.ItemIndicator>
      </span>
      {children}
    </MenuContextoPrimitivo.RadioItem>
  );
}

function RotuloMenuContexto({ className, recuado, inset, ...props }) {
  const recuadoReal = recuado || inset;

  return (
    <MenuContextoPrimitivo.Label
      data-slot="context-menu-label"
      data-inset={recuadoReal}
      className={cn(
        "text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

function SeparadorMenuContexto({ className, ...props }) {
  return (
    <MenuContextoPrimitivo.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function AtalhoMenuContexto({ className, ...props }) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

export {
  MenuContexto,
  GatilhoMenuContexto,
  ConteudoMenuContexto,
  ItemMenuContexto,
  ItemCaixaSelecaoMenuContexto,
  ItemRadioMenuContexto,
  RotuloMenuContexto,
  SeparadorMenuContexto,
  AtalhoMenuContexto,
  GrupoMenuContexto,
  PortalMenuContexto,
  SubMenuContexto,
  ConteudoSubMenuContexto,
  GatilhoSubMenuContexto,
  GrupoRadioMenuContexto,
};

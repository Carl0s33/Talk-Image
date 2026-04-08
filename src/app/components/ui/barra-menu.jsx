import * as React from "react";
import * as BarraMenuPrimitivo from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "./utils";

function BarraMenu({ className, ...props }) {
  return (
    <BarraMenuPrimitivo.Root
      data-slot="menubar"
      className={cn(
        "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className
      )}
      {...props}
    />
  );
}

function MenuBarraMenu({ ...props }) {
  return <BarraMenuPrimitivo.Menu data-slot="menubar-menu" {...props} />;
}

function GrupoBarraMenu({ ...props }) {
  return <BarraMenuPrimitivo.Group data-slot="menubar-group" {...props} />;
}

function PortalBarraMenu({ ...props }) {
  return <BarraMenuPrimitivo.Portal data-slot="menubar-portal" {...props} />;
}

function GrupoRadioBarraMenu({ ...props }) {
  return (
    <BarraMenuPrimitivo.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

function GatilhoBarraMenu({ className, ...props }) {
  return (
    <BarraMenuPrimitivo.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        className
      )}
      {...props}
    />
  );
}

function ConteudoBarraMenu({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}) {
  return (
    <PortalBarraMenu>
      <BarraMenuPrimitivo.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </PortalBarraMenu>
  );
}

function ItemBarraMenu({ className, recuado, inset, variante = "padrao", variant, ...props }) {
  const recuadoReal = recuado || inset;
  const varianteReal = variante === "padrao" ? "default" : (variant || variante);

  return (
    <BarraMenuPrimitivo.Item
      data-slot="menubar-item"
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

function ItemCaixaSelecaoBarraMenu({ className, children, checked, ...props }) {
  return (
    <BarraMenuPrimitivo.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <BarraMenuPrimitivo.ItemIndicator>
          <CheckIcon className="size-4" />
        </BarraMenuPrimitivo.ItemIndicator>
      </span>
      {children}
    </BarraMenuPrimitivo.CheckboxItem>
  );
}

function ItemRadioBarraMenu({ className, children, ...props }) {
  return (
    <BarraMenuPrimitivo.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <BarraMenuPrimitivo.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </BarraMenuPrimitivo.ItemIndicator>
      </span>
      {children}
    </BarraMenuPrimitivo.RadioItem>
  );
}

function RotuloBarraMenu({ className, recuado, inset, ...props }) {
  const recuadoReal = recuado || inset;

  return (
    <BarraMenuPrimitivo.Label
      data-slot="menubar-label"
      data-inset={recuadoReal}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

function SeparadorBarraMenu({ className, ...props }) {
  return (
    <BarraMenuPrimitivo.Separator
      data-slot="menubar-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function AtalhoBarraMenu({ className, ...props }) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

function SubBarraMenu({ ...props }) {
  return <BarraMenuPrimitivo.Sub data-slot="menubar-sub" {...props} />;
}

function GatilhoSubBarraMenu({ className, recuado, inset, children, ...props }) {
  const recuadoReal = recuado || inset;

  return (
    <BarraMenuPrimitivo.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={recuadoReal}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </BarraMenuPrimitivo.SubTrigger>
  );
}

function ConteudoSubBarraMenu({ className, ...props }) {
  return (
    <BarraMenuPrimitivo.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export {
  BarraMenu,
  PortalBarraMenu,
  MenuBarraMenu,
  GatilhoBarraMenu,
  ConteudoBarraMenu,
  GrupoBarraMenu,
  SeparadorBarraMenu,
  RotuloBarraMenu,
  ItemBarraMenu,
  AtalhoBarraMenu,
  ItemCaixaSelecaoBarraMenu,
  GrupoRadioBarraMenu,
  ItemRadioBarraMenu,
  SubBarraMenu,
  GatilhoSubBarraMenu,
  ConteudoSubBarraMenu,
};

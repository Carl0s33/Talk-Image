import * as React from "react";
import * as MenuSuspensoPrimitivo from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "./utils";

function MenuSuspenso({ ...props }) {
  return <MenuSuspensoPrimitivo.Root data-slot="dropdown-menu" {...props} />;
}

function PortalMenuSuspenso({ ...props }) {
  return (
    <MenuSuspensoPrimitivo.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function GatilhoMenuSuspenso({ ...props }) {
  return (
    <MenuSuspensoPrimitivo.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function ConteudoMenuSuspenso({ className, sideOffset = 4, ...props }) {
  return (
    <MenuSuspensoPrimitivo.Portal>
      <MenuSuspensoPrimitivo.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </MenuSuspensoPrimitivo.Portal>
  );
}

function GrupoMenuSuspenso({ ...props }) {
  return (
    <MenuSuspensoPrimitivo.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function ItemMenuSuspenso({ className, recuado, inset, variante = "padrao", variant, ...props }) {
  const recuadoReal = recuado || inset;
  const varianteReal = variante === "padrao" ? "default" : (variant || variante);

  return (
    <MenuSuspensoPrimitivo.Item
      data-slot="dropdown-menu-item"
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

function ItemCaixaSelecaoMenuSuspenso({ className, children, checked, ...props }) {
  return (
    <MenuSuspensoPrimitivo.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuSuspensoPrimitivo.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenuSuspensoPrimitivo.ItemIndicator>
      </span>
      {children}
    </MenuSuspensoPrimitivo.CheckboxItem>
  );
}

function GrupoRadioMenuSuspenso({ ...props }) {
  return (
    <MenuSuspensoPrimitivo.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function ItemRadioMenuSuspenso({ className, children, ...props }) {
  return (
    <MenuSuspensoPrimitivo.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuSuspensoPrimitivo.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenuSuspensoPrimitivo.ItemIndicator>
      </span>
      {children}
    </MenuSuspensoPrimitivo.RadioItem>
  );
}

function RotuloMenuSuspenso({ className, recuado, inset, ...props }) {
  const recuadoReal = recuado || inset;

  return (
    <MenuSuspensoPrimitivo.Label
      data-slot="dropdown-menu-label"
      data-inset={recuadoReal}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

function SeparadorMenuSuspenso({ className, ...props }) {
  return (
    <MenuSuspensoPrimitivo.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function AtalhoMenuSuspenso({ className, ...props }) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

function SubMenuSuspenso({ ...props }) {
  return <MenuSuspensoPrimitivo.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function GatilhoSubMenuSuspenso({ className, recuado, inset, children, ...props }) {
  const recuadoReal = recuado || inset;

  return (
    <MenuSuspensoPrimitivo.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={recuadoReal}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenuSuspensoPrimitivo.SubTrigger>
  );
}

function ConteudoSubMenuSuspenso({ className, ...props }) {
  return (
    <MenuSuspensoPrimitivo.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export {
  MenuSuspenso,
  PortalMenuSuspenso,
  GatilhoMenuSuspenso,
  ConteudoMenuSuspenso,
  GrupoMenuSuspenso,
  RotuloMenuSuspenso,
  ItemMenuSuspenso,
  ItemCaixaSelecaoMenuSuspenso,
  GrupoRadioMenuSuspenso,
  ItemRadioMenuSuspenso,
  SeparadorMenuSuspenso,
  AtalhoMenuSuspenso,
  SubMenuSuspenso,
  GatilhoSubMenuSuspenso,
  ConteudoSubMenuSuspenso,
};

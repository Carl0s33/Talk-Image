import * as React from "react";
import { Command as ComandoPrimitivo } from "cmdk";
import { SearchIcon } from "lucide-react";
import { cn } from "./utils";
import {
  Dialogo,
  ConteudoDialogo,
  DescricaoDialogo,
  CabecalhoDialogo,
  TituloDialogo,
} from "./dialogo";

function Comando({ className, ...props }) {
  return (
    <ComandoPrimitivo
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      )}
      {...props}
    />
  );
}

function DialogoComando({
  titulo = "Paleta de Comandos",
  descricao = "Pesquise um comando para executar...",
  children,
  ...props
}) {
  return (
    <Dialogo {...props}>
      <CabecalhoDialogo className="sr-only">
        <TituloDialogo>{titulo}</TituloDialogo>
        <DescricaoDialogo>{descricao}</DescricaoDialogo>
      </CabecalhoDialogo>
      <ConteudoDialogo className="overflow-hidden p-0">
        <Comando className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Comando>
      </ConteudoDialogo>
    </Dialogo>
  );
}

function EntradaComando({ className, ...props }) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <ComandoPrimitivo.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
}

function ListaComando({ className, ...props }) {
  return (
    <ComandoPrimitivo.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  );
}

function VazioComando({ ...props }) {
  return (
    <ComandoPrimitivo.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

function GrupoComando({ className, ...props }) {
  return (
    <ComandoPrimitivo.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  );
}

function SeparadorComando({ className, ...props }) {
  return (
    <ComandoPrimitivo.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

function ItemComando({ className, ...props }) {
  return (
    <ComandoPrimitivo.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function AtalhoComando({ className, ...props }) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

export {
  Comando,
  DialogoComando,
  EntradaComando,
  ListaComando,
  VazioComando,
  GrupoComando,
  ItemComando,
  AtalhoComando,
  SeparadorComando,
};

import * as React from "react";
import * as DialogoAlertaPrimitivo from "@radix-ui/react-alert-dialog";
import { cn } from "./utils";
import { variantesBotao } from "./botao";

function DialogoAlerta({ ...props }) {
  return (
    <DialogoAlertaPrimitivo.Root data-slot="alert-dialog" {...props} />
  );
}

function GatilhoDialogoAlerta({ ...props }) {
  return (
    <DialogoAlertaPrimitivo.Trigger
      data-slot="alert-dialog-trigger"
      {...props}
    />
  );
}

function PortalDialogoAlerta({ ...props }) {
  return (
    <DialogoAlertaPrimitivo.Portal
      data-slot="alert-dialog-portal"
      {...props}
    />
  );
}

function CoberturaDialogoAlerta({ className, ...props }) {
  return (
    <DialogoAlertaPrimitivo.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function ConteudoDialogoAlerta({ className, ...props }) {
  return (
    <PortalDialogoAlerta>
      <CoberturaDialogoAlerta />
      <DialogoAlertaPrimitivo.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </PortalDialogoAlerta>
  );
}

function CabecalhoDialogoAlerta({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function RodapeDialogoAlerta({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function TituloDialogoAlerta({ className, ...props }) {
  return (
    <DialogoAlertaPrimitivo.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function DescricaoDialogoAlerta({ className, ...props }) {
  return (
    <DialogoAlertaPrimitivo.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AcaoDialogoAlerta({ className, ...props }) {
  return (
    <DialogoAlertaPrimitivo.Action
      className={cn(variantesBotao({ variante: "padrao" }), className)}
      {...props}
    />
  );
}

function CancelarDialogoAlerta({ className, ...props }) {
  return (
    <DialogoAlertaPrimitivo.Cancel
      className={cn(variantesBotao({ variante: "contorno" }), className)}
      {...props}
    />
  );
}

export {
  DialogoAlerta,
  PortalDialogoAlerta,
  CoberturaDialogoAlerta,
  GatilhoDialogoAlerta,
  ConteudoDialogoAlerta,
  CabecalhoDialogoAlerta,
  RodapeDialogoAlerta,
  TituloDialogoAlerta,
  DescricaoDialogoAlerta,
  AcaoDialogoAlerta,
  CancelarDialogoAlerta,
};

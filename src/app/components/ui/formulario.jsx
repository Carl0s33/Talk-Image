import * as React from "react";
import * as RotuloPrimitivo from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { cn } from "./utils";
import { Rotulo } from "./rotulo";

const Formulario = FormProvider;

const ContextoCampoFormulario = React.createContext({});

const CampoFormulario = ({ ...props }) => {
  return (
    <ContextoCampoFormulario.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </ContextoCampoFormulario.Provider>
  );
};

const usarCampoFormulario = () => {
  const contextoField = React.useContext(ContextoCampoFormulario);
  const contextoItem = React.useContext(ContextoItemFormulario);
  const { getFieldState } = useFormContext();
  const estadoFormulario = useFormState({ name: contextoField.name });
  const estadoCampo = getFieldState(contextoField.name, estadoFormulario);

  if (!contextoField) {
    throw new Error(
      "usarCampoFormulario deve ser usado dentro de <CampoFormulario>"
    );
  }

  const { id } = contextoItem;

  return {
    id,
    name: contextoField.name,
    idItemFormulario: `${id}-form-item`,
    idDescricaoFormulario: `${id}-form-item-description`,
    idMensagemFormulario: `${id}-form-item-message`,
    ...estadoCampo,
  };
};

const ContextoItemFormulario = React.createContext({});

function ItemFormulario({ className, ...props }) {
  const id = React.useId();

  return (
    <ContextoItemFormulario.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </ContextoItemFormulario.Provider>
  );
}

function RotuloFormulario({ className, ...props }) {
  const { error, idItemFormulario } = usarCampoFormulario();

  return (
    <Rotulo
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={idItemFormulario}
      {...props}
    />
  );
}

function ControleFormulario({ ...props }) {
  const {
    error,
    idItemFormulario,
    idDescricaoFormulario,
    idMensagemFormulario,
  } = usarCampoFormulario();

  return (
    <Slot
      data-slot="form-control"
      id={idItemFormulario}
      aria-describedby={
        !error
          ? `${idDescricaoFormulario}`
          : `${idDescricaoFormulario} ${idMensagemFormulario}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function DescricaoFormulario({ className, ...props }) {
  const { idDescricaoFormulario } = usarCampoFormulario();

  return (
    <p
      data-slot="form-description"
      id={idDescricaoFormulario}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function MensagemFormulario({ className, ...props }) {
  const { error, idMensagemFormulario } = usarCampoFormulario();
  const corpo = error ? String(error?.message ?? "") : props.children;

  if (!corpo) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={idMensagemFormulario}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {corpo}
    </p>
  );
}

export {
  usarCampoFormulario,
  Formulario,
  ItemFormulario,
  RotuloFormulario,
  ControleFormulario,
  DescricaoFormulario,
  MensagemFormulario,
  CampoFormulario,
};

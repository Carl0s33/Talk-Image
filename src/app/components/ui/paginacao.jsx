import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "./utils";
import { variantesBotao } from "./botao";

function Paginacao({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="paginação"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function ConteudoPaginacao({ className, ...props }) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function ItemPaginacao({ ...props }) {
  return <li data-slot="pagination-item" {...props} />;
}

function LinkPaginacao({ className, ativa, isActive, tamanho = "icone", size, ...props }) {
  const estaAtiva = ativa || isActive;
  const tamanhoReal = tamanho === "icone" ? "icon" : (size || tamanho);

  return (
    <a
      aria-current={estaAtiva ? "page" : undefined}
      data-slot="pagination-link"
      data-active={estaAtiva}
      className={cn(
        variantesBotao({
          variante: estaAtiva ? "contorno" : "fantasma",
          tamanho: tamanhoReal,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginacaoAnterior({ className, ...props }) {
  return (
    <LinkPaginacao
      aria-label="Ir para página anterior"
      tamanho="padrao"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Anterior</span>
    </LinkPaginacao>
  );
}

function PaginacaoProxima({ className, ...props }) {
  return (
    <LinkPaginacao
      aria-label="Ir para próxima página"
      tamanho="padrao"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Próxima</span>
      <ChevronRightIcon />
    </LinkPaginacao>
  );
}

function ReticenciasPaginacao({ className, ...props }) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">Mais páginas</span>
    </span>
  );
}

export {
  Paginacao,
  ConteudoPaginacao,
  LinkPaginacao,
  ItemPaginacao,
  PaginacaoAnterior,
  PaginacaoProxima,
  ReticenciasPaginacao,
};

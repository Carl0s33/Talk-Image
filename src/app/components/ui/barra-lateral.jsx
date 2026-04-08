import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { usarEhMovel } from "./use-mobile";
import { cn } from "./utils";
import { Botao } from "./botao";
import { Entrada } from "./entrada";
import { Separador } from "./separador";
import { Painel, ConteudoPainel, DescricaoPainel, CabecalhoPainel, TituloPainel } from "./painel";
import { Esqueleto } from "./esqueleto";
import { Dica, ConteudoDica, ProvedorDica, GatilhoDica } from "./dica";

const NOME_COOKIE_BARRA = "sidebar_state";
const MAX_AGE_COOKIE_BARRA = 60 * 60 * 24 * 7;
const LARGURA_BARRA = "16rem";
const LARGURA_BARRA_MOVEL = "18rem";
const LARGURA_BARRA_ICONE = "3rem";
const ATALHO_BARRA = "b";

const ContextoBarraLateral = React.createContext(null);

function usarBarraLateral() {
  const contexto = React.useContext(ContextoBarraLateral);
  if (!contexto) {
    throw new Error(
      "usarBarraLateral deve ser usado dentro de ProvedorBarraLateral."
    );
  }
  return contexto;
}

function ProvedorBarraLateral({
  abertoPadrao = true,
  aberto: abertoProp,
  aoMudarAberto: definirAbertoProp,
  className,
  style,
  children,
  ...props
}) {
  const ehMovel = usarEhMovel();
  const [abertoMovel, definirAbertoMovel] = React.useState(false);

  const [_aberto, _definirAberto] = React.useState(abertoPadrao);
  const aberto = abertoProp ?? _aberto;
  const definirAberto = React.useCallback(
    (valor) => {
      const estadoAberto = typeof valor === "function" ? valor(aberto) : valor;
      if (definirAbertoProp) {
        definirAbertoProp(estadoAberto);
      } else {
        _definirAberto(estadoAberto);
      }
      document.cookie = `${NOME_COOKIE_BARRA}=${estadoAberto}; path=/; max-age=${MAX_AGE_COOKIE_BARRA}`;
    },
    [definirAbertoProp, aberto]
  );

  const alternarBarra = React.useCallback(() => {
    return ehMovel
      ? definirAbertoMovel((a) => !a)
      : definirAberto((a) => !a);
  }, [ehMovel, definirAberto, definirAbertoMovel]);

  React.useEffect(() => {
    const aoTecla = (evento) => {
      if (
        evento.key === ATALHO_BARRA &&
        (evento.metaKey || evento.ctrlKey)
      ) {
        evento.preventDefault();
        alternarBarra();
      }
    };
    window.addEventListener("keydown", aoTecla);
    return () => window.removeEventListener("keydown", aoTecla);
  }, [alternarBarra]);

  const estado = aberto ? "expanded" : "collapsed";

  const valorContexto = React.useMemo(
    () => ({
      estado,
      aberto,
      definirAberto,
      ehMovel,
      abertoMovel,
      definirAbertoMovel,
      alternarBarra,
    }),
    [estado, aberto, definirAberto, ehMovel, abertoMovel, definirAbertoMovel, alternarBarra]
  );

  return (
    <ContextoBarraLateral.Provider value={valorContexto}>
      <ProvedorDica delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          ref={(el) => {
            if (el) {
              el.style.setProperty("--sidebar-width", LARGURA_BARRA);
              el.style.setProperty("--sidebar-width-icon", LARGURA_BARRA_ICONE);
              if (style) {
                Object.entries(style).forEach(([k, v]) =>
                  el.style.setProperty(k, v)
                );
              }
            }
          }}
          {...props}
        >
          {children}
        </div>
      </ProvedorDica>
    </ContextoBarraLateral.Provider>
  );
}

function BarraLateral({
  lado = "left",
  variante = "sidebar",
  recolhivel = "offcanvas",
  className,
  children,
  side,
  variant,
  collapsible,
  ...props
}) {
  const ladoReal = lado || side || "left";
  const varianteReal = variante || variant || "sidebar";
  const recolhivelReal = recolhivel || collapsible || "offcanvas";

  const { ehMovel, estado, abertoMovel, definirAbertoMovel } = usarBarraLateral();

  if (recolhivelReal === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (ehMovel) {
    return (
      <Painel aberto={abertoMovel} aoMudarAberto={definirAbertoMovel} open={abertoMovel} onOpenChange={definirAbertoMovel} {...props}>
        <ConteudoPainel
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          lado={ladoReal}
          ref={(el) => {
            if (el) el.style.setProperty("--sidebar-width", LARGURA_BARRA_MOVEL);
          }}
        >
          <CabecalhoPainel className="sr-only">
            <TituloPainel>Barra Lateral</TituloPainel>
            <DescricaoPainel>Exibe a barra lateral no celular.</DescricaoPainel>
          </CabecalhoPainel>
          <div className="flex h-full w-full flex-col">{children}</div>
        </ConteudoPainel>
      </Painel>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={estado}
      data-collapsible={estado === "collapsed" ? recolhivelReal : ""}
      data-variant={varianteReal}
      data-side={ladoReal}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          varianteReal === "floating" || varianteReal === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          ladoReal === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          varianteReal === "floating" || varianteReal === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function GatilhoBarraLateral({ className, onClick, ...props }) {
  const { alternarBarra } = usarBarraLateral();

  return (
    <Botao
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variante="fantasma"
      tamanho="icone"
      className={cn("size-7", className)}
      onClick={(evento) => {
        onClick?.(evento);
        alternarBarra();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Alternar Barra Lateral</span>
    </Botao>
  );
}

function TrilhoBarraLateral({ className, ...props }) {
  const { alternarBarra } = usarBarraLateral();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Alternar Barra Lateral"
      tabIndex={-1}
      onClick={alternarBarra}
      title="Alternar Barra Lateral"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  );
}

function InsetBarraLateral({ className, ...props }) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  );
}

function EntradaBarraLateral({ className, ...props }) {
  return (
    <Entrada
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  );
}

function CabecalhoBarraLateral({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function RodapeBarraLateral({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SeparadorBarraLateral({ className, ...props }) {
  return (
    <Separador
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  );
}

function ConteudoBarraLateral({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

function GrupoBarraLateral({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

function RotuloGrupoBarraLateral({ className, comoFilho = false, asChild, ...props }) {
  const Comp = (comoFilho || asChild) ? Slot : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function AcaoGrupoBarraLateral({ className, comoFilho = false, asChild, ...props }) {
  const Comp = (comoFilho || asChild) ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

function ConteudoGrupoBarraLateral({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function MenuBarraLateral({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function ItemMenuBarraLateral({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const variantesBotaoMenuBarra = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variante: {
        padrao: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        contorno:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      tamanho: {
        padrao: "h-8 text-sm",
        pequeno: "h-7 text-xs",
        grande: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variante: "padrao",
      tamanho: "padrao",
    },
  }
);

function BotaoMenuBarraLateral({
  comoFilho = false,
  asChild,
  estaAtivo = false,
  isActive,
  variante = "padrao",
  variant,
  tamanho = "padrao",
  size,
  dica,
  tooltip,
  className,
  ...props
}) {
  const Comp = (comoFilho || asChild) ? Slot : "button";
  const { ehMovel, estado } = usarBarraLateral();
  const estaAtivoReal = estaAtivo || isActive || false;
  const varianteReal = variante || variant || "padrao";
  const tamanhoReal = tamanho || size || "padrao";
  const dicaReal = dica || tooltip;

  const botao = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={tamanhoReal}
      data-active={estaAtivoReal}
      className={cn(
        variantesBotaoMenuBarra({ variante: varianteReal, tamanho: tamanhoReal }),
        className
      )}
      {...props}
    />
  );

  if (!dicaReal) return botao;

  const conteudoDica =
    typeof dicaReal === "string" ? { children: dicaReal } : dicaReal;

  return (
    <Dica>
      <GatilhoDica asChild>{botao}</GatilhoDica>
      <ConteudoDica
        side="right"
        align="center"
        hidden={estado !== "collapsed" || ehMovel}
        {...conteudoDica}
      />
    </Dica>
  );
}

function AcaoMenuBarraLateral({
  className,
  comoFilho = false,
  asChild,
  mostrarAoPassar = false,
  showOnHover,
  ...props
}) {
  const Comp = (comoFilho || asChild) ? Slot : "button";
  const mostrarAoPassarReal = mostrarAoPassar || showOnHover || false;

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        mostrarAoPassarReal &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function InsigniaMenuBarraLateral({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

function EsqueletoMenuBarraLateral({ className, mostrarIcone = false, showIcon, ...props }) {
  const mostrarIconeReal = mostrarIcone || showIcon || false;
  const largura = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {mostrarIconeReal && (
        <Esqueleto
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Esqueleto
        className="h-4 flex-1"
        data-sidebar="menu-skeleton-text"
        ref={(el) => {
          if (el) el.style.maxWidth = largura;
        }}
      />
    </div>
  );
}

function SubMenuBarraLateral({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

function ItemSubMenuBarraLateral({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

function BotaoSubMenuBarraLateral({
  comoFilho = false,
  asChild,
  tamanho = "md",
  size,
  estaAtivo = false,
  isActive,
  className,
  ...props
}) {
  const Comp = (comoFilho || asChild) ? Slot : "a";
  const tamanhoReal = tamanho || size || "md";
  const estaAtivoReal = estaAtivo || isActive || false;

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={tamanhoReal}
      data-active={estaAtivoReal}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        tamanhoReal === "sm" && "text-xs",
        tamanhoReal === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

export {
  BarraLateral,
  ConteudoBarraLateral,
  RodapeBarraLateral,
  GrupoBarraLateral,
  AcaoGrupoBarraLateral,
  ConteudoGrupoBarraLateral,
  RotuloGrupoBarraLateral,
  CabecalhoBarraLateral,
  EntradaBarraLateral,
  InsetBarraLateral,
  MenuBarraLateral,
  AcaoMenuBarraLateral,
  InsigniaMenuBarraLateral,
  BotaoMenuBarraLateral,
  ItemMenuBarraLateral,
  EsqueletoMenuBarraLateral,
  SubMenuBarraLateral,
  BotaoSubMenuBarraLateral,
  ItemSubMenuBarraLateral,
  ProvedorBarraLateral,
  TrilhoBarraLateral,
  SeparadorBarraLateral,
  GatilhoBarraLateral,
  usarBarraLateral,
};

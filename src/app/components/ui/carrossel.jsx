import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "./utils";
import { Botao } from "./botao";

const ContextoCarrossel = React.createContext(null);

function usarCarrossel() {
  const contexto = React.useContext(ContextoCarrossel);

  if (!contexto) {
    throw new Error("usarCarrossel deve ser usado dentro de um <Carrossel />");
  }

  return contexto;
}

function Carrossel({
  orientacao = "horizontal",
  opcoes,
  definirApi,
  plugins,
  className,
  children,
  orientation,
  opts,
  setApi,
  ...props
}) {
  const orientacaoReal = orientacao || orientation || "horizontal";
  const opcoesReal = opcoes || opts;
  const definirApiReal = definirApi || setApi;

  const [refCarrossel, api] = useEmblaCarousel(
    {
      ...opcoesReal,
      axis: orientacaoReal === "horizontal" ? "x" : "y",
    },
    plugins
  );

  const [podePaginaAnterior, definirPodePaginaAnterior] = React.useState(false);
  const [podePaginaProxima, definirPodePaginaProxima] = React.useState(false);

  const aoSelecionar = React.useCallback((api) => {
    if (!api) return;
    definirPodePaginaAnterior(api.canScrollPrev());
    definirPodePaginaProxima(api.canScrollNext());
  }, []);

  const rolarAnterior = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const rolarProxima = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const aoTecla = React.useCallback(
    (evento) => {
      if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        rolarAnterior();
      } else if (evento.key === "ArrowRight") {
        evento.preventDefault();
        rolarProxima();
      }
    },
    [rolarAnterior, rolarProxima]
  );

  React.useEffect(() => {
    if (!api || !definirApiReal) return;
    definirApiReal(api);
  }, [api, definirApiReal]);

  React.useEffect(() => {
    if (!api) return;
    aoSelecionar(api);
    api.on("reInit", aoSelecionar);
    api.on("select", aoSelecionar);

    return () => {
      api?.off("select", aoSelecionar);
    };
  }, [api, aoSelecionar]);

  return (
    <ContextoCarrossel.Provider
      value={{
        refCarrossel,
        api,
        opcoes: opcoesReal,
        orientacao:
          orientacaoReal || (opcoesReal?.axis === "y" ? "vertical" : "horizontal"),
        rolarAnterior,
        rolarProxima,
        podePaginaAnterior,
        podePaginaProxima,
      }}
    >
      <div
        onKeyDownCapture={aoTecla}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carrossel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </ContextoCarrossel.Provider>
  );
}

function ConteudoCarrossel({ className, ...props }) {
  const { refCarrossel, orientacao } = usarCarrossel();

  return (
    <div
      ref={refCarrossel}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientacao === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
}

function ItemCarrossel({ className, ...props }) {
  const { orientacao } = usarCarrossel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientacao === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
}

function BotaoAnteriorCarrossel({ className, variante = "contorno", tamanho = "icone", ...props }) {
  const { orientacao, rolarAnterior, podePaginaAnterior } = usarCarrossel();

  return (
    <Botao
      data-slot="carousel-previous"
      variante={variante}
      tamanho={tamanho}
      className={cn(
        "absolute size-8 rounded-full",
        orientacao === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!podePaginaAnterior}
      onClick={rolarAnterior}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Slide anterior</span>
    </Botao>
  );
}

function BotaoProximoCarrossel({ className, variante = "contorno", tamanho = "icone", ...props }) {
  const { orientacao, rolarProxima, podePaginaProxima } = usarCarrossel();

  return (
    <Botao
      data-slot="carousel-next"
      variante={variante}
      tamanho={tamanho}
      className={cn(
        "absolute size-8 rounded-full",
        orientacao === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!podePaginaProxima}
      onClick={rolarProxima}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Próximo slide</span>
    </Botao>
  );
}

export {
  Carrossel,
  ConteudoCarrossel,
  ItemCarrossel,
  BotaoAnteriorCarrossel,
  BotaoProximoCarrossel,
};

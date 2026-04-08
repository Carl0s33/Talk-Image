import * as React from "react";
import * as RechartsPrimitivo from "recharts";
import { cn } from "./utils";

const TEMAS = { light: "", dark: ".dark" };

const ContextoGrafico = React.createContext(null);

function usarGrafico() {
  const contexto = React.useContext(ContextoGrafico);

  if (!contexto) {
    throw new Error("usarGrafico deve ser usado dentro de um <ConteinerGrafico />");
  }

  return contexto;
}

function ConteinerGrafico({ id, className, children, config, ...props }) {
  const idUnico = React.useId();
  const idGrafico = `chart-${id || idUnico.replace(/:/g, "")}`;

  return (
    <ContextoGrafico.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={idGrafico}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <EstiloGrafico id={idGrafico} config={config} />
        <RechartsPrimitivo.ResponsiveContainer>
          {children}
        </RechartsPrimitivo.ResponsiveContainer>
      </div>
    </ContextoGrafico.Provider>
  );
}

const EstiloGrafico = ({ id, config }) => {
  const configCores = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  );

  if (!configCores.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(TEMAS)
          .map(
            ([tema, prefixo]) => `
${prefixo} [data-chart=${id}] {
${configCores
  .map(([chave, itemConfig]) => {
    const cor =
      itemConfig.theme?.[tema] || itemConfig.color;
    return cor ? `  --color-${chave}: ${cor};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

const DicaGrafico = RechartsPrimitivo.Tooltip;

function ConteudoDicaGrafico({
  active,
  payload,
  className,
  indicador = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}) {
  const { config } = usarGrafico();

  const rotuloTooltip = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const chave = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = obterConfigDoPayload(config, item, chave);
    const valor =
      !labelKey && typeof label === "string"
        ? config[label]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(valor, payload)}
        </div>
      );
    }

    if (!valor) return null;

    return <div className={cn("font-medium", labelClassName)}>{valor}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) {
    return null;
  }

  const rotuloAninhado = payload.length === 1 && indicador !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!rotuloAninhado ? rotuloTooltip : null}
      <div className="grid gap-1.5">
        {payload.map((item, indice) => {
          const chave = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = obterConfigDoPayload(config, item, chave);
          const corIndicador = color || item.payload.fill || item.color;

          return (
            <div
              key={item.dataKey}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicador === "dot" && "items-center"
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, indice, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <IndicadorInline
                        tipo={indicador}
                        cor={corIndicador}
                        aninhado={rotuloAninhado}
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      rotuloAninhado ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {rotuloAninhado ? rotuloTooltip : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Indicador extraído para evitar style inline no payload principal */
function IndicadorInline({ tipo, cor, aninhado }) {
  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
        {
          "h-2.5 w-2.5": tipo === "dot",
          "w-1": tipo === "line",
          "w-0 border-[1.5px] border-dashed bg-transparent": tipo === "dashed",
          "my-0.5": aninhado && tipo === "dashed",
        }
      )}
      ref={(el) => {
        if (el) {
          el.style.setProperty("--color-bg", cor || "");
          el.style.setProperty("--color-border", cor || "");
        }
      }}
    />
  );
}

const LegendaGrafico = RechartsPrimitivo.Legend;

function ConteudoLegendaGrafico({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}) {
  const { config } = usarGrafico();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const chave = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = obterConfigDoPayload(config, item, chave);

        return (
          <div
            key={item.value}
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <QuadradoCor cor={item.color} />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

/* Quadrado de cor da legenda extraído para evitar style inline */
function QuadradoCor({ cor }) {
  return (
    <div
      className="h-2 w-2 shrink-0 rounded-[2px]"
      ref={(el) => {
        if (el) el.style.backgroundColor = cor || "";
      }}
    />
  );
}

function obterConfigDoPayload(config, payload, chave) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadInterno =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let chaveConfigRotulo = chave;

  if (chave in payload && typeof payload[chave] === "string") {
    chaveConfigRotulo = payload[chave];
  } else if (
    payloadInterno &&
    chave in payloadInterno &&
    typeof payloadInterno[chave] === "string"
  ) {
    chaveConfigRotulo = payloadInterno[chave];
  }

  return chaveConfigRotulo in config
    ? config[chaveConfigRotulo]
    : config[chave];
}

export {
  ConteinerGrafico,
  DicaGrafico,
  ConteudoDicaGrafico,
  LegendaGrafico,
  ConteudoLegendaGrafico,
  EstiloGrafico,
};

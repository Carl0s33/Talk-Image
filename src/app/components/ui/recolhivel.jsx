import * as RecolhivelPrimitivo from "@radix-ui/react-collapsible";

function Recolhivel({ ...props }) {
  return <RecolhivelPrimitivo.Root data-slot="collapsible" {...props} />;
}

function GatilhoRecolhivel({ ...props }) {
  return (
    <RecolhivelPrimitivo.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function ConteudoRecolhivel({ ...props }) {
  return (
    <RecolhivelPrimitivo.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Recolhivel, GatilhoRecolhivel, ConteudoRecolhivel };

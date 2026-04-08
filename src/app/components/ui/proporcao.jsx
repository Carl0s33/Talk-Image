import * as ProporcaoPrimitivo from "@radix-ui/react-aspect-ratio";

function ProporcaoAspecto({ ...props }) {
  return <ProporcaoPrimitivo.Root data-slot="aspect-ratio" {...props} />;
}

export { ProporcaoAspecto };

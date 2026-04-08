import * as React from "react";
import * as ProgressoPrimitivo from "@radix-ui/react-progress";
import { cn } from "./utils";
import "./progresso.css";

function Progresso({ className, value, ...props }) {
  const deslocamento = 100 - (value || 0);

  return (
    <ProgressoPrimitivo.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressoPrimitivo.Indicator
        data-slot="progress-indicator"
        className="progresso-indicador"
        data-deslocamento={deslocamento}
        ref={(el) => {
          if (el) {
            el.style.setProperty(
              "--progresso-deslocamento",
              `${deslocamento}%`
            );
          }
        }}
      />
    </ProgressoPrimitivo.Root>
  );
}

export { Progresso };

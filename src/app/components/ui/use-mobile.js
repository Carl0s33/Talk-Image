import * as React from "react";

const PONTO_QUEBRA_MOVEL = 768;

export function usarEhMovel() {
  const [ehMovel, definirEhMovel] = React.useState(undefined);

  React.useEffect(() => {
    const consultaMidia = window.matchMedia(
      `(max-width: ${PONTO_QUEBRA_MOVEL - 1}px)`
    );
    const aoMudar = () => {
      definirEhMovel(window.innerWidth < PONTO_QUEBRA_MOVEL);
    };
    consultaMidia.addEventListener("change", aoMudar);
    definirEhMovel(window.innerWidth < PONTO_QUEBRA_MOVEL);
    return () => consultaMidia.removeEventListener("change", aoMudar);
  }, []);

  return !!ehMovel;
}

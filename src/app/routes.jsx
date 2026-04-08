import GravadorSinais from './pages/GravadorSinais';
import PaginaTextoVoz from './pages/PaginaTextoVoz';
import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import PaginaInicial from './pages/PaginaInicial';
import PaginaLibrasTexto from './pages/PaginaLibrasTexto';
import PaginaTextoLibras from './pages/PaginaTextoLibras';
import PaginaVozLibras from './pages/PaginaVozLibras';
import PaginaLibrasVoz from './pages/PaginaLibrasVoz';

// 1. Importando a nossa página de teste focada
import TesteMaos from './pages/TesteMaos';

export const roteador = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true,            Component: PaginaInicial },
      { path: 'libras-texto',   Component: PaginaLibrasTexto },
      { path: 'texto-libras',   Component: PaginaTextoLibras },
      { path: 'voz-libras',     Component: PaginaVozLibras   },
      { path: 'libras-voz',     Component: PaginaLibrasVoz   },
      { path: 'texto-voz',      Component: PaginaTextoVoz    },
      { path: 'gravador-sinais', Component: GravadorSinais },
      // 2. A nova rota para você acessar o MediaPipe isolado
      { path: 'teste-maos',     Component: TesteMaos         },
    ],
  },
]);
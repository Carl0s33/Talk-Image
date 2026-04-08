import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  Menu, X, Hand, Home, Info, Phone, Accessibility,
  ZoomIn, ZoomOut, Contrast, Type, Eye, BookOpen,
  ChevronDown, ChevronLeft,
} from 'lucide-react';
import './Layout.css';

/* -----------------------------------------------
   Dados de Navegação
   ----------------------------------------------- */
const itensMenuLateral = [
  { id: 1, rotulo: 'Início',          Icone: Home,          href: '/'  },
  { id: 2, rotulo: 'Sobre o Projeto', Icone: Info,          href: '/sobre'  },
  { id: 3, rotulo: 'Acessibilidade',  Icone: Accessibility, href: '/acessibilidade'  },
  { id: 4, rotulo: 'Contato',         Icone: Phone,         href: '/contato'  },
];

const opcoesAcessibilidade = [
  { id: 'aumentar',  rotulo: 'Aumentar\nFonte',  Icone: ZoomIn,   acao: 'aumentarFonte' },
  { id: 'diminuir',  rotulo: 'Diminuir\nFonte',  Icone: ZoomOut,  acao: 'diminuirFonte' },
  { id: 'contraste', rotulo: 'Alto\nContraste',  Icone: Contrast, acao: 'contraste'     },
  { id: 'leitura',   rotulo: 'Modo\nLeitura',    Icone: Type,     acao: 'leitura'       },
  { id: 'daltonico', rotulo: 'Modo\nDaltônico',  Icone: Eye,      acao: 'daltonico'     },
  { id: 'libras',    rotulo: 'VLibras',          Icone: BookOpen, acao: 'libras'        },
];

const titulos = {
  '/':             null,
  '/libras-texto': 'Libras → Texto',
  '/texto-libras': 'Texto → Libras',
  '/voz-libras':   'Voz → Libras',
  '/libras-voz':   'Libras → Voz',
};

/* -----------------------------------------------
   Splash Screen
   ----------------------------------------------- */
function TelaAbertura({ visivel, saindo }) {
  if (!visivel) return null;
  return (
    <div
      className={`la-splash${saindo ? ' la-splash--saindo' : ''}`}
      role="status"
      aria-label="Carregando Talk IMAGE"
      aria-live="polite"
    >
      <div className="la-splash__corpo">
        <div className="la-splash__logo" aria-hidden="true">
          <Hand size={68} />
        </div>
        <h1 className="la-splash__titulo">Talk IMAGE</h1>
        <p className="la-splash__sub">Acessibilidade e Tradução em Libras</p>
        <div className="la-splash__barra-wrap" aria-hidden="true">
          <div className="la-splash__barra" />
        </div>
        <p className="la-splash__loading" aria-live="polite">Carregando...</p>
      </div>
      <div className="la-splash__rodape" aria-hidden="true">
        <span className="la-splash__ifrn-sigla">IFRN</span>
        <span className="la-splash__ifrn-nome">Instituto Federal do Rio Grande do Norte</span>
      </div>
    </div>
  );
}

/* -----------------------------------------------
   Menu Lateral
   ----------------------------------------------- */
function MenuLateral({ aberto, aoFechar, location }) {
  return (
    <>
      {aberto && <div className="la-overlay" onClick={aoFechar} aria-hidden="true" />}
      <nav
        id="menu-lateral"
        className={`la-menu${aberto ? ' la-menu--aberto' : ''}`}
        aria-label="Menu de navegação principal"
        aria-hidden={!aberto}
      >
        <div className="la-menu__cabecalho">
          <div className="la-menu__marca">
            <Hand size={20} aria-hidden="true" />
            <span className="la-menu__nome">Talk IMAGE</span>
          </div>
          <button className="la-menu__fechar" onClick={aoFechar} aria-label="Fechar menu">
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="la-menu__ifrn">
          <span className="la-menu__ifrn-sigla">IFRN</span>
          <span className="la-menu__ifrn-texto">Instituto Federal do Rio Grande do Norte</span>
        </div>

        <ul className="la-menu__lista" role="list">
          {itensMenuLateral.map(({ id, rotulo, Icone, href }) => (
            <li key={id} role="listitem">
              <Link
                to={href}
                className={`la-menu__link${location.pathname === href ? ' la-menu__link--ativo' : ''}`}
                onClick={aoFechar}
              >
                <Icone size={20} className="la-menu__link-icone" aria-hidden="true" />
                <span>{rotulo}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="la-menu__rodape">
          <p className="la-menu__rodape-txt">Versão 1.0.0</p>
          <p className="la-menu__rodape-txt">© 2026 IFRN</p>
        </div>
      </nav>
    </>
  );
}

/* -----------------------------------------------
   Dropdown de Acessibilidade
   ----------------------------------------------- */
function DropdownAcessibilidade({ ativos, aoAcionar }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fora = (e) => { if (ref.current && !ref.current.contains(e.target)) setAberto(false); };
    const tecla = (e) => { if (e.key === 'Escape') setAberto(false); };
    if (aberto) { document.addEventListener('mousedown', fora); document.addEventListener('keydown', tecla); }
    return () => { document.removeEventListener('mousedown', fora); document.removeEventListener('keydown', tecla); };
  }, [aberto]);

  const qtd = Object.values(ativos).filter(Boolean).length;

  return (
    <div className="la-acesso" ref={ref}>
      <button
        className={`la-acesso__btn${aberto ? ' la-acesso__btn--aberto' : ''}${qtd > 0 ? ' la-acesso__btn--ativo' : ''}`}
        onClick={() => setAberto(a => !a)}
        aria-haspopup="true"
        aria-expanded={aberto}
        aria-label={`Acessibilidade${qtd > 0 ? ` — ${qtd} ativa${qtd > 1 ? 's' : ''}` : ''}`}
        title="Opções de acessibilidade"
      >
        <Accessibility size={22} aria-hidden="true" />
        {qtd > 0 && <span className="la-acesso__contador" aria-hidden="true">{qtd}</span>}
        <ChevronDown size={13} className={`la-acesso__seta${aberto ? ' la-acesso__seta--aberto' : ''}`} aria-hidden="true" />
      </button>

      {aberto && (
        <div className="la-acesso__painel" role="region" aria-label="Opções de acessibilidade">
          <div className="la-acesso__painel-cabecalho">
            <span className="la-acesso__painel-titulo">Acessibilidade</span>
            <button className="la-acesso__painel-fechar" onClick={() => setAberto(false)} aria-label="Fechar">
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          <div className="la-acesso__grade" role="group" aria-label="Ferramentas">
            {opcoesAcessibilidade.map(({ id, rotulo, Icone, acao }) => (
              <button
                key={id}
                className={`la-acesso__quadrado${ativos[acao] ? ' la-acesso__quadrado--ativo' : ''}`}
                onClick={() => aoAcionar(acao)}
                aria-pressed={!!ativos[acao]}
                aria-label={rotulo.replace('\n', ' ')}
                title={rotulo.replace('\n', ' ')}
              >
                <Icone size={22} aria-hidden="true" />
                <span className="la-acesso__rotulo">{rotulo}</span>
              </button>
            ))}
          </div>

          {qtd > 0 && (
            <div className="la-acesso__rodape">
              <button
                className="la-acesso__limpar"
                onClick={() => opcoesAcessibilidade.forEach(({ acao }) => { if (ativos[acao]) aoAcionar(acao); })}
              >
                Redefinir tudo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -----------------------------------------------
   Cabeçalho
   ----------------------------------------------- */
function Cabecalho({ aoAbrirMenu, menuAberto, ativos, aoAcionar, location, navigate }) {
  const eHome = location.pathname === '/';
  const titulo = titulos[location.pathname];

  return (
    <header className="la-cabecalho" role="banner">
      {eHome ? (
        <button
          className="la-cabecalho__btn-menu"
          onClick={aoAbrirMenu}
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
          aria-controls="menu-lateral"
        >
          <Menu size={27} aria-hidden="true" />
        </button>
      ) : (
        <button
          className="la-cabecalho__btn-menu la-cabecalho__btn-voltar"
          onClick={() => navigate(-1)}
          aria-label="Voltar à página anterior"
        >
          <ChevronLeft size={27} aria-hidden="true" />
        </button>
      )}

      <div className="la-cabecalho__marca">
        {titulo ? (
          <span className="la-cabecalho__titulo-pag">{titulo}</span>
        ) : (
          <>
            <Hand size={21} className="la-cabecalho__icone" aria-hidden="true" />
            <div className="la-cabecalho__marca-txt">
              <span className="la-cabecalho__nome">Talk IMAGE</span>
              <span className="la-cabecalho__ifrn">IFRN</span>
            </div>
          </>
        )}
      </div>

      <DropdownAcessibilidade ativos={ativos} aoAcionar={aoAcionar} />
    </header>
  );
}

/* -----------------------------------------------
   Rodapé
   ----------------------------------------------- */
function Rodape() {
  return (
    <footer className="la-rodape" role="contentinfo">
      <div className="la-rodape__conteudo">
        <p className="la-rodape__txt">Talk IMAGE — Acessibilidade em Libras</p>
        <p className="la-rodape__txt la-rodape__txt--ifrn">
          IFRN — Instituto Federal do Rio Grande do Norte &copy; 2026
        </p>
      </div>
    </footer>
  );
}

/* -----------------------------------------------
   Layout Principal
   ----------------------------------------------- */
function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [splashVisivel,  setSplashVisivel]  = useState(true);
  const [splashSaindo,   setSplashSaindo]   = useState(false);
  const [menuAberto,     setMenuAberto]     = useState(false);
  const [ativos, setAtivos] = useState({
    aumentarFonte: false,
    diminuirFonte: false,
    contraste:     false,
    leitura:       false,
    daltonico:     false,
    libras:        false,
  });

  useEffect(() => {
    const t1 = setTimeout(() => setSplashSaindo(true),   2500);
    const t2 = setTimeout(() => setSplashVisivel(false), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const r = document.documentElement;
    r.classList.toggle('alto-contraste', ativos.contraste);
    r.classList.toggle('modo-leitura',   ativos.leitura);
    r.classList.toggle('modo-daltonico', ativos.daltonico);
    r.classList.toggle('fonte-grande',   ativos.aumentarFonte);
    r.classList.toggle('fonte-pequena',  ativos.diminuirFonte);
  }, [ativos]);

  const aoAcionar = useCallback((acao) => {
    setAtivos(prev => {
      const next = { ...prev };
      if (acao === 'aumentarFonte') {
        next.aumentarFonte = !prev.aumentarFonte;
        if (next.aumentarFonte) next.diminuirFonte = false;
      } else if (acao === 'diminuirFonte') {
        next.diminuirFonte = !prev.diminuirFonte;
        if (next.diminuirFonte) next.aumentarFonte = false;
      } else {
        next[acao] = !prev[acao];
      }
      return next;
    });
  }, []);

  return (
    <>
      <TelaAbertura visivel={splashVisivel} saindo={splashSaindo} />

      <div className="la-raiz">
        <a href="#conteudo-principal" className="la-skip">Pular para o conteúdo principal</a>

        <MenuLateral aberto={menuAberto} aoFechar={() => setMenuAberto(false)} location={location} />

        <Cabecalho
          aoAbrirMenu={() => setMenuAberto(true)}
          menuAberto={menuAberto}
          ativos={ativos}
          aoAcionar={aoAcionar}
          location={location}
          navigate={navigate}
        />

        <main className="la-conteudo" id="conteudo-principal" role="main">
          <Outlet />
        </main>

        <Rodape />
      </div>
    </>
  );
}

export default Layout;
import React, { useState, useEffect } from 'react';
import {
  FileText, Hand, Loader, AlertCircle
} from 'lucide-react';
import './PaginaTextoLibras.css';

const MAX = 300;

const glosses = {
  'bom dia':       ['BOM','DIA'],
  'boa tarde':     ['BOA','TARDE'],
  'boa noite':     ['BOA','NOITE'],
  'obrigado':      ['OBRIGADO'],
  'obrigada':      ['OBRIGADO'],
  'por favor':     ['POR','FAVOR'],
  'me ajude':      ['EU','PRECISAR','AJUDA'],
  'como vai':      ['COMO','VOCÊ','IR'],
  'tudo bem':      ['TUDO','BEM'],
  'olá':           ['OLÁ'],
  'oi':            ['OLÁ'],
  'tchau':         ['TCHAU'],
  'sim':           ['SIM'],
  'não':           ['NÃO'],
  'eu':            ['EU'],
  'você':          ['VOCÊ'],
  'nós':           ['NÓS'],
  'obrigado pela atenção': ['OBRIGADO','ATENÇÃO'],
};

function tokenizar(texto) {
  const t = texto.toLowerCase().trim();
  for (const [chave, val] of Object.entries(glosses)) {
    if (t.includes(chave)) return val;
  }
  return t.split(/\s+/).filter(Boolean).map(w => w.toUpperCase().replace(/[^A-ZÁÉÍÓÚÀÂÊÔÃÕÇ]/g,''));
}

export default function PaginaTextoLibras() {
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState('idle');
  const [glossList, setGlossList] = useState([]);

  useEffect(() => {
    if (document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]')) return;

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        
        // Início automático: Aguarda a renderização e clica no botão invisível
        setTimeout(() => {
          const btnVlibras = document.querySelector('[vw-access-button="true"]');
          if (btnVlibras) {
            btnVlibras.click();
          }
        }, 1500);
      }
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  function traduzir() {
    if (!texto.trim()) return;
    setEstado('traduzindo');

    // Integração direta: Força a tradução via DOM no painel oculto do VLibras
    const txtArea = document.querySelector('.vp-user-textarea');
    const btnTraduzir = document.querySelector('.vp-translator-screen-content .vp-play-gloss-button');

    if (txtArea && btnTraduzir) {
      const setterNativo = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      setterNativo.call(txtArea, texto);

      txtArea.dispatchEvent(new Event('input', { bubbles: true }));
      txtArea.dispatchEvent(new Event('change', { bubbles: true }));

      setTimeout(() => {
        btnTraduzir.removeAttribute('disabled');
        btnTraduzir.click();
      }, 300);
    } else if (window.plugin && typeof window.plugin.translate === 'function') {
      window.plugin.translate(texto);
    }

    setGlossList([]);
    setTimeout(() => {
      const tokens = tokenizar(texto);
      setGlossList(tokens);
      setEstado('pronto');
    }, 1600);
  }

  function limparTudo() {
    setTexto('');
    setEstado('idle');
    setGlossList([]);
  }

  const charRestante = MAX - texto.length;

  return (
    <div className="ptl-wrap">
      <section className="ptl-secao" aria-labelledby="ptl-texto-titulo">
        <div className="ptl-secao__cabecalho">
          <FileText size={18} aria-hidden="true" />
          <h2 className="ptl-secao__titulo" id="ptl-texto-titulo">Digite o Texto</h2>
        </div>
        <div className="ptl-textarea-wrap">
          <textarea
            className="ptl-textarea"
            value={texto}
            onChange={e => setTexto(e.target.value.slice(0, MAX))}
            placeholder="Ex.: Bom dia! Tudo bem com você?"
            aria-label="Texto para traduzir para Libras"
            rows={4}
            spellCheck
          />
          <span className={`ptl-contador${charRestante < 30 ? ' ptl-contador--alerta' : ''}`}>
            {charRestante}
          </span>
        </div>

        <div className="ptl-acoes-texto">
          <button
            className="ptl-btn ptl-btn--primario"
            onClick={(e) => { e.stopPropagation(); traduzir(); }}
            onMouseUp={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!texto.trim() || estado === 'traduzindo'}
            aria-busy={estado === 'traduzindo'}
          >
            {estado === 'traduzindo'
              ? <><Loader size={17} className="ptl-spin" aria-hidden="true" /> Traduzindo...</>
              : <><Hand size={17} aria-hidden="true" /> Traduzir para Libras</>
            }
          </button>
          {estado !== 'idle' && (
            <button 
              className="ptl-btn ptl-btn--fantasma" 
              onClick={(e) => { e.stopPropagation(); limparTudo(); }}
              onMouseUp={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              Limpar
            </button>
          )}
        </div>
      </section>

      <section className="ptl-secao" aria-labelledby="ptl-avatar-titulo">
        <div className="ptl-secao__cabecalho">
          <Hand size={18} aria-hidden="true" />
          <h2 className="ptl-secao__titulo" id="ptl-avatar-titulo">Visualização em Libras</h2>
        </div>

        <div className="ptl-avatar-area">
          <div vw="true" className="enabled">
            <div vw-access-button="true" className="active"></div>
            <div vw-plugin-wrapper="true">
              <div className="vw-plugin-top-wrapper"></div>
            </div>
          </div>
        </div>

        {estado === 'pronto' && glossList.length > 0 && (
          <div className="ptl-glosas" role="list">
            {glossList.map((g, i) => (
              <span key={i} className="ptl-glosa" role="listitem">
                {g}
              </span>
            ))}
          </div>
        )}
      </section>

      {estado === 'idle' && (
        <div className="ptl-dica" role="note">
          <AlertCircle size={16} aria-hidden="true" />
          <p>Digite qualquer texto em português. O sistema acionará o avatar oficial do VLibras para demonstrar a tradução.</p>
        </div>
      )}
    </div>
  );
}
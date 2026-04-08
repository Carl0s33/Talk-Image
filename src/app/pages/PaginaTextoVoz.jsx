import React, { useState } from 'react';
import { FileText, Volume2, Loader } from 'lucide-react';
import './PaginaTextoVoz.css';

export default function PaginaTextoVoz() {
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState('idle');
  const [sintese, setSintese] = useState(null);

  function falar() {
    if (!texto.trim()) return;
    setEstado('falando');
    const synth = window.speechSynthesis;
    const utter = new window.SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR';
    utter.onend = () => {
      setEstado('pronto');
      setSintese(null);
    };
    setSintese(utter);
    synth.speak(utter);
  }

  function limparTudo() {
    setTexto('');
    setEstado('idle');
    setSintese(null);
    window.speechSynthesis.cancel();
  }

  return (
    <div className="ptv-wrap">
      <section className="ptv-secao" aria-labelledby="ptv-texto-titulo">
        <div className="ptv-secao__cabecalho">
          <FileText size={18} aria-hidden="true" />
          <h2 className="ptv-secao__titulo" id="ptv-texto-titulo">Digite o Texto</h2>
        </div>
        <div className="ptv-textarea-wrap">
          <textarea
            className="ptv-textarea"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Ex.: Olá, tudo bem?"
            aria-label="Texto para sintetizar em voz"
            rows={4}
            spellCheck
          />
        </div>
        <div className="ptv-acoes-texto">
          <button
            className="ptv-btn ptv-btn--primario"
            onClick={falar}
            disabled={!texto.trim() || estado === 'falando'}
            aria-busy={estado === 'falando'}
          >
            {estado === 'falando'
              ? <><Loader size={17} className="ptv-spin" aria-hidden="true" /> Falando...</>
              : <><Volume2 size={17} aria-hidden="true" /> Falar Texto</>
            }
          </button>
          {estado !== 'idle' && (
            <button 
              className="ptv-btn ptv-btn--fantasma" 
              onClick={limparTudo}
            >
              Limpar
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

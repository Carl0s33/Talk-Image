import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Square, Hand, Volume2,
  AlertCircle, Clock, Loader,
} from 'lucide-react';
import './PaginaVozLibras.css';

const frases = [
  { fala: 'Bom dia, como vai você?',       glosas: ['BOM','DIA','COMO','VOCÊ','IR']        },
  { fala: 'Preciso de ajuda, por favor.',   glosas: ['EU','PRECISAR','AJUDA','POR','FAVOR'] },
  { fala: 'Obrigado pela sua atenção.',     glosas: ['OBRIGADO','SUA','ATENÇÃO']            },
  { fala: 'Onde fica o banheiro?',          glosas: ['ONDE','BANHEIRO']                     },
  { fala: 'Qual é o seu nome?',             glosas: ['QUAL','NOME','VOCÊ']                  },
  { fala: 'Tudo bem, muito obrigado.',      glosas: ['TUDO','BEM','MUITO','OBRIGADO']       },
];

const N_BARRAS = 16;

function Waveform({ ativo }) {
  return (
    <div className="pvl-waveform" aria-hidden="true">
      {Array.from({ length: N_BARRAS }).map((_, i) => (
        <div
          key={i}
          className={`pvl-waveform__barra${ativo ? ' pvl-waveform__barra--ativo' : ''}`}
          style={{ animationDelay: `${(i * 0.07).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}

export default function PaginaVozLibras() {
  const [estado,    setEstado]   = useState('idle');    // idle | ouvindo | processando | pronto
  const [fala,      setFala]     = useState('');
  const [glosas,    setGlosas]   = useState([]);
  const [tempo,     setTempo]    = useState(0);
  const [historico, setHistorico] = useState([]);
  const [indiceAnim, setIndiceAnim] = useState(-1);
  const timerRef    = useRef(null);
  const charRef     = useRef(0);
  const cronRef     = useRef(null);

  function iniciar() {
    setEstado('ouvindo');
    setFala('');
    setGlosas([]);
    setTempo(0);
    setIndiceAnim(-1);
    charRef.current = 0;

    // cronômetro
    cronRef.current = setInterval(() => setTempo(t => t + 1), 1000);

    // Simula transcrição aparecendo
    const amostra = frases[Math.floor(Math.random() * frases.length)];
    const frase = amostra.fala;

    setTimeout(() => {
      timerRef.current = setInterval(() => {
        charRef.current += 2;
        setFala(frase.slice(0, charRef.current));
        if (charRef.current >= frase.length) {
          clearInterval(timerRef.current);
        }
      }, 60);
    }, 800);

    setTimeout(() => parar(amostra), 4500);
  }

  function parar(amostra) {
    clearInterval(timerRef.current);
    clearInterval(cronRef.current);
    setEstado('processando');

    setTimeout(() => {
      const ref = amostra || frases[0];
      setFala(ref.fala);
      setGlosas(ref.glosas);

      // anima glosas uma por uma
      let i = 0;
      setIndiceAnim(0);
      timerRef.current = setInterval(() => {
        i++;
        if (i >= ref.glosas.length) {
          clearInterval(timerRef.current);
          setIndiceAnim(-1);
        } else {
          setIndiceAnim(i);
        }
      }, 700);

      setEstado('pronto');
      setHistorico(h => [
        { id: Date.now(), fala: ref.fala, glosas: ref.glosas, hora: new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) },
        ...h,
      ].slice(0, 5));
    }, 1200);
  }

  function pararManual() {
    clearInterval(timerRef.current);
    clearInterval(cronRef.current);
    parar(null);
  }

  function novaGravacao() {
    clearInterval(timerRef.current);
    clearInterval(cronRef.current);
    setEstado('idle');
    setFala('');
    setGlosas([]);
    setTempo(0);
    setIndiceAnim(-1);
  }

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(cronRef.current);
  }, []);

  const mm = String(Math.floor(tempo / 60)).padStart(2, '0');
  const ss = String(tempo % 60).padStart(2, '0');

  return (
    <div className="pvl-wrap">
      {/* Microfone */}
      <section className="pvl-secao" aria-labelledby="pvl-mic-titulo">
        <div className="pvl-secao__cabecalho">
          <Mic size={18} aria-hidden="true" />
          <h2 className="pvl-secao__titulo" id="pvl-mic-titulo">Microfone</h2>
          {estado === 'ouvindo' && (
            <div className="pvl-badge pvl-badge--ouvindo">
              <span className="pvl-badge__dot" aria-hidden="true" />
              Ouvindo… {mm}:{ss}
            </div>
          )}
        </div>

        <div className="pvl-mic-area">
          {/* Anel pulsante */}
          <div className={`pvl-mic-container${estado === 'ouvindo' ? ' pvl-mic-container--ativo' : ''}`}>
            <div className="pvl-mic-anel pvl-mic-anel--1" aria-hidden="true" />
            <div className="pvl-mic-anel pvl-mic-anel--2" aria-hidden="true" />
            <button
              className={`pvl-mic-btn${estado === 'ouvindo' ? ' pvl-mic-btn--gravando' : ''}`}
              onClick={estado === 'idle' || estado === 'pronto' ? iniciar : pararManual}
              aria-label={estado === 'ouvindo' ? 'Parar gravação' : 'Iniciar gravação de voz'}
              disabled={estado === 'processando'}
            >
              {estado === 'ouvindo'
                ? <Square size={28} aria-hidden="true" />
                : estado === 'processando'
                  ? <Loader size={28} className="pvl-spin" aria-hidden="true" />
                  : <Mic size={32} aria-hidden="true" />
              }
            </button>
          </div>

          <Waveform ativo={estado === 'ouvindo'} />

          <p className="pvl-mic-instrucao">
            {estado === 'idle'     && 'Toque no microfone e fale naturalmente'}
            {estado === 'ouvindo'  && 'Ouvindo sua voz…'}
            {estado === 'processando' && 'Processando áudio…'}
            {estado === 'pronto'   && 'Tradução concluída!'}
          </p>
        </div>
      </section>

      {/* Transcrição */}
      {(estado === 'ouvindo' || estado === 'processando' || estado === 'pronto') && (
        <section className="pvl-secao" aria-labelledby="pvl-trans-titulo">
          <div className="pvl-secao__cabecalho">
            <Volume2 size={18} aria-hidden="true" />
            <h2 className="pvl-secao__titulo" id="pvl-trans-titulo">O que foi dito</h2>
          </div>
          <div className="pvl-transcricao" aria-live="polite">
            {fala
              ? <p className="pvl-transcricao__texto">{fala}</p>
              : <p className="pvl-transcricao__aguardando">Aguardando transcrição…</p>
            }
          </div>
        </section>
      )}

      {/* Glosas Libras */}
      {glosas.length > 0 && (
        <section className="pvl-secao" aria-labelledby="pvl-libras-titulo">
          <div className="pvl-secao__cabecalho">
            <Hand size={18} aria-hidden="true" />
            <h2 className="pvl-secao__titulo" id="pvl-libras-titulo">Tradução em Libras</h2>
          </div>
          <div className="pvl-libras" aria-live="polite">
            <div className="pvl-glosas" role="list" aria-label="Glosas em Libras">
              {glosas.map((g, i) => (
                <span
                  key={i}
                  className={`pvl-glosa${i === indiceAnim ? ' pvl-glosa--ativo' : ''}`}
                  role="listitem"
                >
                  {g}
                </span>
              ))}
            </div>
            <button className="pvl-btn-nova" onClick={novaGravacao}>
              <Mic size={16} aria-hidden="true" />
              Nova Gravação
            </button>
          </div>
        </section>
      )}

      {/* Histórico */}
      {historico.length > 0 && (
        <section className="pvl-secao" aria-labelledby="pvl-hist-titulo">
          <div className="pvl-secao__cabecalho">
            <Clock size={18} aria-hidden="true" />
            <h2 className="pvl-secao__titulo" id="pvl-hist-titulo">Histórico</h2>
            <button className="pvl-btn-link" onClick={() => setHistorico([])}>Limpar</button>
          </div>
          <ul className="pvl-historico" role="list">
            {historico.map(item => (
              <li key={item.id} className="pvl-historico__item">
                <span className="pvl-historico__fala">"{item.fala}"</span>
                <div className="pvl-historico__meta">
                  <span>{item.hora}</span>
                  <span className="pvl-historico__glosas-count">{item.glosas.length} sinais</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Dica */}
      {estado === 'idle' && (
        <div className="pvl-dica" role="note">
          <AlertCircle size={16} aria-hidden="true" />
          <p>Fale claramente e em português. O sistema transcrevê sua voz e exibirá a tradução em Libras automaticamente.</p>
        </div>
      )}
    </div>
  );
}

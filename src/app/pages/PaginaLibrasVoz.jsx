import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, CameraOff, Hand, Volume2, VolumeX,
  PlayCircle, Loader, AlertCircle, Clock, Gauge,
  CircleDot, Square,
} from 'lucide-react';
import './PaginaLibrasVoz.css';

const deteccoes = [
  { sinal: 'OBRIGADO',  audio: 'Obrigado!',                 confianca: 96 },
  { sinal: 'BOM DIA',   audio: 'Bom dia!',                  confianca: 92 },
  { sinal: 'OLÁ',       audio: 'Olá, tudo bem?',            confianca: 98 },
  { sinal: 'POR FAVOR', audio: 'Por favor.',                 confianca: 88 },
  { sinal: 'TCHAU',     audio: 'Até logo! Tchau!',          confianca: 94 },
  { sinal: 'AJUDA',     audio: 'Preciso de ajuda.',          confianca: 85 },
  { sinal: 'SIM',       audio: 'Sim.',                      confianca: 99 },
  { sinal: 'NÃO',       audio: 'Não.',                      confianca: 97 },
];

const vozes_mock = ['Masculina', 'Feminina', 'Neutra'];

export default function PaginaLibrasVoz() {
  const [estado,     setEstado]     = useState('idle');   // idle | ativando | ativo | detectando | resultado
  const [deteccao,   setDeteccao]   = useState(null);
  const [reproduzindo, setReproduzindo] = useState(false);
  const [volume,     setVolume]     = useState(80);
  const [velocidade, setVelocidade] = useState(1);
  const [voz,        setVoz]        = useState('Feminina');
  const [historico,  setHistorico]  = useState([]);
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  function ativarCamera() {
    setEstado('ativando');
    setTimeout(() => setEstado('ativo'), 1700);
  }

  function iniciarDeteccao() {
    setEstado('detectando');
    setDeteccao(null);

    const t = setTimeout(() => {
      const amostra = deteccoes[Math.floor(Math.random() * deteccoes.length)];
      setDeteccao(amostra);
      setEstado('resultado');
      setHistorico(h => [
        { id: Date.now(), ...amostra, hora: new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) },
        ...h,
      ].slice(0, 8));
    }, 2800);

    timerRef.current = t;
  }

  function pararDeteccao() {
    clearTimeout(timerRef.current);
    setEstado('ativo');
  }

  function desligar() {
    clearTimeout(timerRef.current);
    setEstado('idle');
    setDeteccao(null);
    setReproduzindo(false);
  }

  function reproduzirAudio() {
    if (reproduzindo || !deteccao) return;
    setReproduzindo(true);

    // Simula TTS com Web Audio API (beep)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = (volume / 100) * 0.15;
      osc.frequency.value = 220;
      osc.type = 'sine';
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (1.5 / velocidade));
      osc.stop(ctx.currentTime + (1.5 / velocidade) + 0.05);
    } catch (_) {}

    const dur = (1800 / velocidade);
    setTimeout(() => setReproduzindo(false), dur);
  }

  function novaDeteccao() {
    setDeteccao(null);
    setEstado('ativo');
    setReproduzindo(false);
  }

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="plv-wrap">
      {/* Câmera */}
      <section className="plv-secao" aria-labelledby="plv-cam-titulo">
        <div className="plv-secao__cabecalho">
          <Camera size={18} aria-hidden="true" />
          <h2 className="plv-secao__titulo" id="plv-cam-titulo">Câmera</h2>
          <div className={`plv-badge${estado === 'detectando' ? ' plv-badge--detectando' : estado === 'ativo' || estado === 'resultado' ? ' plv-badge--ativo' : ''}`}>
            <span className="plv-badge__dot" aria-hidden="true" />
            {estado === 'detectando' ? 'Detectando sinal' : estado === 'ativo' ? 'Câmera ativa' : estado === 'resultado' ? 'Sinal detectado' : estado === 'ativando' ? 'Conectando...' : 'Inativa'}
          </div>
        </div>

        <div className={`plv-viewfinder${estado !== 'idle' ? ' plv-viewfinder--ativo' : ''}`} role="img" aria-label="Câmera para detecção de sinais">
          {estado === 'idle' && (
            <div className="plv-viewfinder__placeholder">
              <CameraOff size={48} aria-hidden="true" />
              <span>Câmera desligada</span>
            </div>
          )}
          {estado === 'ativando' && (
            <div className="plv-viewfinder__placeholder">
              <div className="plv-spinner" aria-hidden="true" />
              <span>Conectando câmera...</span>
            </div>
          )}
          {(estado === 'ativo' || estado === 'detectando' || estado === 'resultado') && (
            <>
              <div className="plv-viewfinder__grade" aria-hidden="true" />
              {estado === 'detectando' && <div className="plv-viewfinder__scanner" aria-hidden="true" />}
              <div className="plv-viewfinder__cantos" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
              <div className={`plv-viewfinder__figura${estado === 'detectando' ? ' plv-viewfinder__figura--anim' : ''}`} aria-hidden="true">
                <Hand size={56} />
              </div>
              {estado === 'resultado' && deteccao && (
                <div className="plv-viewfinder__overlay-sinal" aria-hidden="true">
                  <span className="plv-viewfinder__sinal-txt">{deteccao.sinal}</span>
                  <span className="plv-viewfinder__conf">{deteccao.confianca}%</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="plv-controles">
          {estado === 'idle' && (
            <button className="plv-btn plv-btn--primario" onClick={ativarCamera}>
              <Camera size={17} aria-hidden="true" /> Ativar Câmera
            </button>
          )}
          {estado === 'ativando' && (
            <button className="plv-btn plv-btn--desabilitado" disabled>
              <div className="plv-spinner-sm" aria-hidden="true" /> Conectando...
            </button>
          )}
          {estado === 'ativo' && (
            <>
              <button className="plv-btn plv-btn--detectar" onClick={iniciarDeteccao}>
                <CircleDot size={17} aria-hidden="true" /> Detectar Sinal
              </button>
              <button className="plv-btn plv-btn--fantasma" onClick={desligar} aria-label="Desligar câmera">
                <CameraOff size={17} aria-hidden="true" />
              </button>
            </>
          )}
          {estado === 'detectando' && (
            <>
              <button className="plv-btn plv-btn--parar" onClick={pararDeteccao}>
                <Square size={15} aria-hidden="true" /> Parar Detecção
              </button>
              <button className="plv-btn plv-btn--fantasma" onClick={desligar} aria-label="Desligar câmera">
                <CameraOff size={17} aria-hidden="true" />
              </button>
            </>
          )}
          {estado === 'resultado' && (
            <>
              <button className="plv-btn plv-btn--detectar" onClick={novaDeteccao}>
                <CircleDot size={17} aria-hidden="true" /> Nova Detecção
              </button>
              <button className="plv-btn plv-btn--fantasma" onClick={desligar} aria-label="Desligar câmera">
                <CameraOff size={17} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </section>

      {/* Sinal detectado */}
      {estado === 'resultado' && deteccao && (
        <section className="plv-secao" aria-labelledby="plv-sinal-titulo">
          <div className="plv-secao__cabecalho">
            <Hand size={18} aria-hidden="true" />
            <h2 className="plv-secao__titulo" id="plv-sinal-titulo">Sinal Detectado</h2>
          </div>
          <div className="plv-sinal-card">
            <span className="plv-sinal-card__nome">{deteccao.sinal}</span>
            <div
              className="plv-conf-bar"
              role="meter"
              aria-valuenow={deteccao.confianca}
              aria-valuemin={0} aria-valuemax={100}
              aria-label={`Confiança: ${deteccao.confianca}%`}
            >
              <div className="plv-conf-bar__trilha">
                <div className="plv-conf-bar__fill" style={{ width: `${deteccao.confianca}%` }} />
              </div>
              <span className="plv-conf-bar__label">Confiança: {deteccao.confianca}%</span>
            </div>
          </div>
        </section>
      )}

      {/* Player de Voz */}
      {estado === 'resultado' && deteccao && (
        <section className="plv-secao" aria-labelledby="plv-audio-titulo">
          <div className="plv-secao__cabecalho">
            <Volume2 size={18} aria-hidden="true" />
            <h2 className="plv-secao__titulo" id="plv-audio-titulo">Saída de Voz</h2>
          </div>
          <div className="plv-player">
            {/* Texto que será falado */}
            <div className="plv-player__texto" aria-live="polite">
              <span className="plv-player__frase">"{deteccao.audio}"</span>
            </div>

            {/* Botão play */}
            <button
              className={`plv-player__play${reproduzindo ? ' plv-player__play--ativo' : ''}`}
              onClick={reproduzirAudio}
              disabled={reproduzindo}
              aria-label={reproduzindo ? 'Reproduzindo áudio...' : `Ouvir: ${deteccao.audio}`}
            >
              {reproduzindo
                ? <><Loader size={20} className="plv-spin" aria-hidden="true" /> Reproduzindo...</>
                : <><PlayCircle size={20} aria-hidden="true" /> Ouvir Áudio</>
              }
            </button>

            {/* Controles */}
            <div className="plv-player__controles">
              <div className="plv-player__ctrl">
                <Volume2 size={15} aria-hidden="true" />
                <label htmlFor="plv-volume" className="plv-ctrl-label">Volume</label>
                <input
                  id="plv-volume"
                  type="range" min={0} max={100} step={5}
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="plv-slider"
                  aria-label={`Volume: ${volume}%`}
                />
                <span className="plv-ctrl-val">{volume}%</span>
              </div>

              <div className="plv-player__ctrl">
                <Gauge size={15} aria-hidden="true" />
                <label htmlFor="plv-vel" className="plv-ctrl-label">Velocidade</label>
                <select
                  id="plv-vel"
                  value={velocidade}
                  onChange={e => setVelocidade(Number(e.target.value))}
                  className="plv-select"
                >
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1× (normal)</option>
                  <option value={1.5}>1.5×</option>
                  <option value={2}>2×</option>
                </select>
              </div>

              <div className="plv-player__ctrl">
                <Volume2 size={15} aria-hidden="true" />
                <label htmlFor="plv-voz" className="plv-ctrl-label">Voz</label>
                <select
                  id="plv-voz"
                  value={voz}
                  onChange={e => setVoz(e.target.value)}
                  className="plv-select"
                >
                  {vozes_mock.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Histórico */}
      {historico.length > 0 && (
        <section className="plv-secao" aria-labelledby="plv-hist-titulo">
          <div className="plv-secao__cabecalho">
            <Clock size={18} aria-hidden="true" />
            <h2 className="plv-secao__titulo" id="plv-hist-titulo">Histórico</h2>
            <button className="plv-btn-link" onClick={() => setHistorico([])}>Limpar</button>
          </div>
          <ul className="plv-historico" role="list">
            {historico.map(item => (
              <li key={item.id} className="plv-historico__item">
                <Hand size={14} className="plv-historico__icone" aria-hidden="true" />
                <div className="plv-historico__info">
                  <span className="plv-historico__sinal">{item.sinal}</span>
                  <span className="plv-historico__audio">"{item.audio}"</span>
                </div>
                <div className="plv-historico__meta">
                  <span>{item.hora}</span>
                  <span className="plv-historico__conf">{item.confianca}%</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Dica */}
      {estado === 'idle' && (
        <div className="plv-dica" role="note">
          <AlertCircle size={16} aria-hidden="true" />
          <p>Ative a câmera e faça um sinal em Libras. O sistema reconhecerá o gesto e sintetizará a voz correspondente automaticamente.</p>
        </div>
      )}
    </div>
  );
}
